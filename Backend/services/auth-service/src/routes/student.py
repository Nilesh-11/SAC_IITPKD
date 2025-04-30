from src.utils.auth import hash_password
from src.utils.jwt import create_jwt, verify_jwt
from src.config.config import otp_expiration_time, otp_resend_time, otp_attempt_limit
from src.models.users import Student
from src.models.auth import Otp
from src.schemas.request import StudentSignupRequest, VerifyotpRequest, ResendOtpRequest, LoginRequest, ForgotPasswordRequest, SavePasswordRequest
from src.database.connection import get_users_db, get_auth_db
from src.utils.mail import send_mail_otp
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import datetime

router = APIRouter()

@router.post("/signup")
def signupwithCredentials(data: StudentSignupRequest, db: Session = Depends(get_auth_db), db_user: Session = Depends(get_users_db)):
    existing_user = db_user.query(Student).filter(Student.email == data.email).first()
    if existing_user:
        return JSONResponse(content={"type": "error", "detail": "Email already registered"},
                            status_code=400)
    
    name = data.name
    full_name = data.full_name
    password = data.password
    email = data.email
    ip_addr = data.ip_addr
    user_agent = data.user_agent
    hashed_password = hash_password(password)
    
    try:
        existing_otp = db.query(Otp).filter(Otp.email == email, Otp.is_used == False).first()
        if existing_otp:
            if existing_otp.exp_time <= datetime.datetime.utcnow():
                db.delete(existing_otp)
                db.commit()
            else:
                return JSONResponse(content={"type": "invalid", 'verdict': "otpfound", "detail": "OTP already sent, try resending OTP"},
                                    status_code=400)
        
        mail_response = send_mail_otp(email)
        if mail_response['type'] != 'ok':
            return JSONResponse(content={"type": "error","detail": "OTP not sent, check the input and try again"},
                                status_code=400)
        
        otp_code = mail_response['otp']
        exp_time = datetime.datetime.utcnow() + otp_expiration_time
        
        new_otp = Otp(
            otp_code=otp_code,
            otp_type="email",
            is_used=False,
            created_at=datetime.datetime.utcnow(),
            exp_time=exp_time,
            attempts=0,
            email=email,
            name=name,
            full_name=full_name,
            password_hash=hashed_password,
            ip_addr=ip_addr,
            user_agent=user_agent
        )
        db.add(new_otp)
        db.commit()
        return JSONResponse(content={"type": "ok", 'details': "Otp sent"})
    except Exception as e:
        print("Error in signup with credentials:", e)
        return JSONResponse(content={"type": "error", "detail": "An error occurred with signup"},
                            status_code=500)

@router.post("/verify-otp")
def verify_otp(data: VerifyotpRequest, db: Session = Depends(get_auth_db), db_user: Session = Depends(get_users_db)):
    otp_code = data.otp_code
    email = data.email
    try:
        existing_otp = db.query(Otp).filter(Otp.email == email, Otp.is_used == False).first()
        if not existing_otp:
            return JSONResponse(content={"type": "error", "detail": "No OTP has been sent"},
                                status_code=400)
        if datetime.datetime.utcnow() > existing_otp.exp_time:
            return JSONResponse(content={"type": "error", "detail": "OTP has expired, request a new OTP"},
                                status_code=400)

        if existing_otp.otp_code != otp_code:
            existing_otp.attempts += 1
            db.commit()
            if existing_otp.attempts >= otp_attempt_limit:
                return JSONResponse(content={"type": "error", "detail": "Too many incorrect attempts, request a new OTP"},
                                    status_code=400)
            return JSONResponse(content={"type": "invalid", "detail": "Invalid OTP"},
                                status_code=400)
        existing_otp.is_used = True
        existing_otp.verified_at = datetime.datetime.utcnow()
        db.commit()
        existing_user = db_user.query(Student).filter(Student.email == email).first()
        if existing_user:
            return JSONResponse(content={'type': "ok", 'details': "Student already registered and Otp verified. :O"})
        new_user = Student(
            name=existing_otp.name,
            full_name=existing_otp.full_name,
            password_hash=existing_otp.password_hash,
            registered_date=datetime.datetime.utcnow(),
            email=email
        )
        db_user.add(new_user)
        db_user.commit()
        return JSONResponse(content={"type": "ok", "details": "Student registration successfull :)"})
    except Exception as e:
        print("Error in verifying otp:", e)
        return JSONResponse(content={"type": "error", "detail": "An error occurred verifying OTP"},
                            status_code=500)

@router.post("/resend-otp")
def resend_otp(data: ResendOtpRequest, db: Session = Depends(get_auth_db)):
    email = data.email
    ip_addr = data.ip_addr
    user_agent = data.user_agent
    
    try:
        existing_otp = db.query(Otp).filter(Otp.email == email, Otp.is_used == False).first()
        if existing_otp:
            if existing_otp.lock_until and datetime.datetime.utcnow() < existing_otp.lock_until:
                return JSONResponse(content={"type": "error", "detail": "Wait before requesting again, ;)"},
                                    status_code=400)
            elif existing_otp.resend_count >= 3:
                existing_otp.lock_until = datetime.datetime.utcnow() + otp_resend_time
                existing_otp.resend_count = 0
                return JSONResponse(content={"type": "error", "detail": "Resend limit exceeded, :|"},
                                    status_code=400)
            existing_otp.resend_count += 1
            db.commit()

        mail_response = send_mail_otp(email)
        if mail_response['type'] != 'ok':
            return JSONResponse(content={"type": "error", "detail": "Failed to send OTP"},
                                status_code=500)

        existing_otp.otp_code = mail_response['otp']
        existing_otp.exp_time = datetime.datetime.utcnow() + otp_expiration_time
        existing_otp.otp_type = "email"
        existing_otp.is_used = False
        existing_otp.created_at = datetime.datetime.utcnow()
        existing_otp.attempts = 0
        existing_otp.resend_count = 0
        existing_otp.ip_addr = ip_addr
        existing_otp.user_agent = user_agent
        db.commit()
        return JSONResponse(content={"type": "ok", "detail": "OTP resent"})
    except Exception as e:
        print("Error resending OTP:", e)
        return JSONResponse(content={"type": "error", "detail": "Error resending OTP"},
                            status_code=500)

@router.post("/login")
def user_login(data: LoginRequest, db_user: Session = Depends(get_users_db)):
    email = data.email
    password = data.password
    password_hash = hash_password(password)
    try:
        existing_user = db_user.query(Student).filter(Student.email == email, Student.password_hash == password_hash).first()
        if not existing_user:
            return JSONResponse(content={"type": "error", "details": "Student not found"},status_code=404)
        token = create_jwt(email=existing_user.email, id=str(existing_user.id), role="student", aud="internal")
        return JSONResponse(content={
            "type": "ok",
            "token": token,
            "student": {
                "email": existing_user.email,
                "name": existing_user.name,
            }
        })
    except Exception as e:
        print("Login ERROR:", e)
        return JSONResponse(content={"type": "error", "detail": "Login failed"},
                            status_code=500)

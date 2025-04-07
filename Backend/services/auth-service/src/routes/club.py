from src.utils.auth import hash_password
from src.utils.jwt import create_jwt, verify_jwt
from src.config.config import otp_expiration_time, otp_resend_time
from src.models.user import Club
from src.models.auth import Otp
from src.schemas.request import VerifyotpRequest, ResendOtpRequest, LoginRequest, ForgotPasswordRequest, SavePasswordRequest
from src.database.connection import get_users_db, get_auth_db
from src.utils.mail import send_mail_otp
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import datetime

router = APIRouter()

@router.post("/verify-otp")
def verify_otp(data: VerifyotpRequest, db: Session = Depends(get_auth_db), db_user: Session = Depends(get_users_db)):
    otp_code = data.otp_code
    email = data.email
    try:
        existing_otp = db.query(Otp).filter(Otp.email == email, Otp.is_used == False).first()
        if not existing_otp:
            return {'content':{'type':"error", 'status_code':400, 'detail':"Invalid or expired OTP, retry"}}
        if datetime.datetime.utcnow() > existing_otp.exp_time:
            return {'content':{'type':"error", 'status_code':400, 'detail':"OTP has expired, request a new otp"}}

        if existing_otp.otp_code != otp_code:
            existing_otp.attempts += 1
            db.commit()
            if existing_otp.attempts >= 5:
                return {'content':{'type':"error", 'status_code':400, 'detail':"Too many incorrect attempts. Request a new OTP."}}
            return {'content':{'type':"invalid", 'status_code':400, 'detail':"Invalid OTP"}}

        existing_otp.is_used = True
        existing_otp.verified_at = datetime.datetime.utcnow()
        existing_user = db_user.query(Club).filter(Club.email == email).first()
        if existing_user:
            return {'content':{'type': "ok", 'details': "Otp verified"}}
        new_club = Club(
            name=existing_otp.name,
            password_hash=existing_otp.password_hash,
            registered_date=datetime.datetime.utcnow(),
            email=email
        )
        db_user.add(new_club)
        db_user.commit()
        return {'content':{'type': "ok", 'details': "Club created successfully."}}
    except Exception as e:
        print("Error in verifying otp:", e)
        return {'content':{"type": "error", 'status_code': 500, "detail": "An error occurred with verifying otp"}}

@router.post("/resend-otp")
def resend_otp(data: ResendOtpRequest, db: Session = Depends(get_auth_db)):
    email = data.email
    ip_addr = data.ip_addr
    user_agent = data.user_agent
    
    try:
        existing_otp = db.query(Otp).filter(Otp.email == email, Otp.is_used == False).first()

        if existing_otp:
            if existing_otp.lock_until and datetime.datetime.utcnow() < existing_otp.lock_until:
                return {'content':{"type": "error", "detail": "Wait for a while before sending a request"}}
            elif existing_otp.resend_count >= 3:
                existing_otp.lock_until = datetime.datetime.utcnow() + otp_resend_time
                existing_otp.resend_count = 0
                return {'content':{"type": "error", "detail": "OTP resend limit exceeded. Try again later."}}
            existing_otp.resend_count += 1
            db.commit()

        mail_response = send_mail_otp(email)
        if mail_response['type'] != 'ok':
            raise HTTPException(status_code=500, detail="Failed to send OTP")

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
        return {'content':{"type": "ok", "detail": "OTP resent successfully"}}
    except Exception as e:
        print("Error in resending otp:", e)
        return {'content':{"type": "error", "detail": "An error occurred with resending otp", 'status_code': 500}}

@router.post("/login")
def user_login(data: LoginRequest, db_user: Session = Depends(get_users_db)):
    email = data.email
    password = data.password
    password_hash = hash_password(password)
    try:
        existing_user = db_user.query(Club).filter(Club.email == email, Club.password_hash == password_hash).first()
        if not existing_user:
            return {'content':{'type': "error", 'details': "Club not found"}}
        token = create_jwt(email=existing_user.email, id=str(existing_user.id), role="club", aud="internal")
        return {'content':{'type': "ok", 'token': token}}
    except Exception as e:
        print("Error in log in:", e)
        return {'content':{"type": "error", "detail": "An error occurred with login", 'status_code': 500}}

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_auth_db), db_user: Session = Depends(get_users_db)):
    email = data.email
    ip_addr = data.ip_addr
    user_agent = data.user_agent
    try:
        existing_user = db_user.query(Club).filter(Club.email == email).first()
        if not existing_user:
            return {'content':{'type': "error", 'details': "Club not found, sign up first"}}
        response = send_mail_otp(email)
        if response['type'] != "ok":
            return {'content':{'type': "error", 'details': "mail not sent, try again"}}
        
        otp_code = response['otp']
        exp_time = datetime.datetime.utcnow() + otp_expiration_time
        name = existing_user.name
        hashed_password = existing_user.password_hash
        
        existing_otp = db.query(Otp).filter(Otp.email == email).first()
        
        if existing_otp:
            existing_otp.otp_code = otp_code
            existing_otp.otp_type = "email"
            existing_otp.is_used = False
            existing_otp.created_at = datetime.datetime.utcnow()
            existing_otp.name = name
            existing_otp.password_hash = hashed_password
            existing_otp.ip_addr = ip_addr
            existing_otp.user_agent = user_agent
        else:
            new_otp = Otp(
                otp_code=otp_code,
                otp_type="email",
                is_used=False,
                created_at=datetime.datetime.utcnow(),
                exp_time=exp_time,
                attempts=0,
                email=email,
                name=name,
                password_hash=hashed_password,
                ip_addr=ip_addr,
                user_agent=user_agent
            )
            db.add(new_otp)
        db.commit()
        token = create_jwt(email=existing_user.email, id=str(existing_user.id), role="club", aud="internal")
        return {'content':{'type': "ok", 'token': token}}
    except Exception as e:
        print("Error in log in:", e)
        return {'content':{"type": "error", "detail": "An error occurred with forgot password", 'status_code': 500}}

@router.post("/save-password")
def save_password(data: SavePasswordRequest, db_user: Session = Depends(get_users_db)):
    email = data.email
    token = data.token
    password = data.password
    hashed_password = hash_password(password)

    try:
        existing_user = db_user.query(Club).filter(Club.email == email).first()
        if not existing_user:
            return {'content':{'type': "error", 'details': "Club not found, sign up first"}}
        data = verify_jwt(token)
        if not data:
            return {'content':{'type': "error", 'details': "Unauthorized user"}}
        existing_user.password_hash = hashed_password
        db_user.commit()
        return {'content':{'type': "ok", 'details': "password saved successfully"}}
    except Exception as e:
        print("Error in log in:", e)
        return {'content':{"type": "error", "detail": "An error occurred with saving password", 'status_code': 500}}
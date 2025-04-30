from src.routes import guest, club, student, guest, admin, council
from src.middleware.logging import LoggingMiddleware
from src.database.connection import BaseAuth, engine_auth
from src.models.users import Student, Club, Council, Admin
from src.models.auth import ForgotPassword
from src.utils.auth import hash_password
from src.config.config import FRONTEND_URL
from src.utils.mail import send_password_reset_mail
from src.schemas.request import ResetPasswordRequest,ForgotPasswordRequest
from src.database.connection import get_users_db,get_auth_db
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
import datetime

app = FastAPI(title="Auth Service")

BaseAuth.metadata.create_all(bind=engine_auth)

app.include_router(student.router, prefix="/student")
app.include_router(admin.router, prefix="/admin")
app.include_router(club.router, prefix="/club")
app.include_router(council.router, prefix="/council")
app.include_router(guest.router, prefix="/guest")
app.add_middleware(LoggingMiddleware)


@app.get("/")
def health_check():
    return JSONResponse(
                content= {
                    "status": "Event Service is running"
                }
            )

@app.post("/forgot-password")
def forget_password(data: ForgotPasswordRequest, db: Session = Depends(get_users_db), db_auth: Session = Depends(get_auth_db)):
    email = data.email
    ip_addr = data.ip_addr
    user_agent = data.user_agent
    try:
        user = (
            db.query(Student).filter(Student.email == email).first() or
            db.query(Club).filter(Club.email == email).first() or
            db.query(Council).filter(Council.email == email).first() or
            db.query(Admin).filter(Admin.email == email).first()
        )
        if not user:
            return JSONResponse(content={"type": "error", "details": "Email not found"},status_code=404)
        recent = db_auth.query(ForgotPassword).filter(
            ForgotPassword.email == email,
            ForgotPassword.created_at > datetime.datetime.utcnow() - datetime.timedelta(minutes=5)
        ).count()
        if recent > 3:
            return JSONResponse(content={"type": "error", "details": "Too many reset requests"},status_code=429)
        forgot_entry = ForgotPassword(
            email=email,
            ip_addr=ip_addr,
            user_agent=user_agent,
        )
        db_auth.add(forgot_entry)
        db_auth.commit()
        db_auth.refresh(forgot_entry)
        mail_response = send_password_reset_mail(email, f'{FRONTEND_URL}/reset-password?token={forgot_entry.token}')
        if mail_response['type'] == "error":
            db_auth.delete(forgot_entry)
            db_auth.commit()
            return JSONResponse(content=mail_response, status_code=500)
        return JSONResponse(content={"type": "ok", 'details': "forgot password request successfull, check email, :)"})
    except Exception as e:
        print("Error in Forget password:", e)
        return JSONResponse(content={"type": "error", "detail": "Forgot Password request failed"},
                            status_code=500)

@app.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_users_db), db_auth: Session = Depends(get_auth_db)):
    token=data.token
    new_password=data.new_password
    try:
        existing_token = db_auth.query(ForgotPassword).filter(ForgotPassword.token == token).first()
        if not existing_token:
            return JSONResponse(content={"type": "error", "details": "TokenInvalid"},
                                status_code=400)
        if existing_token.is_used:
            return JSONResponse(content={"type": "error", "details": "TokenUsed"},
                                status_code=400)
        if existing_token.expires_at < datetime.datetime.utcnow():
            return JSONResponse(content={"type": "error", "details": "TokenExpired"},
                                status_code=400)
        existing_user = (
            db.query(Student).filter(Student.email == existing_token.email).first() or
            db.query(Club).filter(Club.email == existing_token.email).first() or
            db.query(Council).filter(Council.email == existing_token.email).first() or
            db.query(Admin).filter(Admin.email == existing_token.email).first()
        )
        if not existing_user:
            return JSONResponse(content={"type": "error", "details": "User not found"},
                                status_code=404)
        existing_user.password_hash = hash_password(new_password)
        existing_token.is_used = True
        existing_token.used_at = datetime.datetime.utcnow()
        db_auth.commit()
        db.commit()
        return JSONResponse(content={"type": "ok", "details": "Password reset successful"})
    except Exception as e:
        print("Error in reset password:", e)
        return JSONResponse(content={"type": "error", "detail": "Password reset failed"},
                            status_code=500)

from src.routes import guest, club, student, guest, admin, council
from src.database.connection import BaseAuth, engine_auth
from src.models.users import Student, Club, Council, Admin
from src.models.auth import ForgotPassword
from src.utils.auth import hash_password
from src.config.config import BACKEND_URL, FRONTEND_URL
from src.utils.mail import send_password_reset_mail
from src.schemas.request import ResetPasswordRequest,ForgotPasswordRequest
from src.database.connection import get_users_db,get_auth_db
from fastapi import FastAPI, Query, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import datetime

app = FastAPI(title="Auth Service")

BaseAuth.metadata.create_all(bind=engine_auth)

app.include_router(student.router, prefix="/student")
app.include_router(admin.router, prefix="/admin")
app.include_router(club.router, prefix="/club")
app.include_router(council.router, prefix="/council")
app.include_router(guest.router, prefix="/guest")

@app.get("/")
def health_check():
    return {"status": "Auth Service is running"}

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
            return {'content': {'type': "error", 'details': "Email not found"}}
        recent = db_auth.query(ForgotPassword).filter(
            ForgotPassword.email == email,
            ForgotPassword.created_at > datetime.datetime.utcnow() - datetime.timedelta(minutes=5)
        ).count()
        if recent > 3:
            return {'content': {'type': "error", 'details': "Too many reset requests, please try again later."}}
        forgot_entry = ForgotPassword(
            email=email,
            ip_addr=ip_addr,
            user_agent=user_agent,
        )
        db_auth.add(forgot_entry)
        db_auth.commit()
        db_auth.refresh(forgot_entry)
        response = send_password_reset_mail(email, f'{FRONTEND_URL}/reset-password?token={forgot_entry.token}')
        if response['type'] == "error":
            db_auth.delete(forgot_entry)
            db_auth.commit()
            return response
        return {'content': response}
    except Exception as e:
        print("Error in Forget password:", e)
        return {'content':{"type": "error", 'status_code': 500, "detail": "An error occurred with forget password"}}

@app.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_users_db), db_auth: Session = Depends(get_auth_db)):
    token=data.token
    new_password=data.new_password
    try:
        existing_token = db_auth.query(ForgotPassword).filter(ForgotPassword.token == token).first()
        if not existing_token:
            return {'content': {'type': "error", 'details': "TokenInvalid"}}
        if existing_token.is_used:
            return {'content': {'type': "error", 'details': "TokenUsed"}}
        if existing_token.expires_at < datetime.datetime.utcnow():
            return {'content': {'type': "error", 'details': "TokenExpired"}}
        existing_user = (
            db.query(Student).filter(Student.email == existing_token.email).first() or
            db.query(Club).filter(Club.email == existing_token.email).first() or
            db.query(Council).filter(Council.email == existing_token.email).first() or
            db.query(Admin).filter(Admin.email == existing_token.email).first()
        )
        if not existing_user:
            return {'content': {'type': "error", 'details': "User not found."}}
        existing_user.password_hash = hash_password(new_password)
        existing_token.is_used = True
        existing_token.used_at = datetime.datetime.utcnow()
        db_auth.commit()
        db.commit()
        return {'content': {'type': "ok", 'details': "Password has been reset successfully"}}
    except Exception as e:
        print("Error in reset password:", e)
        return {'content':{"type": "error", 'status_code': 500, "detail": "An error occurred with reset password"}}

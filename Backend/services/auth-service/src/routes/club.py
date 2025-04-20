from src.utils.auth import hash_password
from src.utils.jwt import create_jwt, verify_jwt
from src.config.config import otp_expiration_time, otp_resend_time
from src.models.users import Club
from src.models.auth import Otp
from src.schemas.request import VerifyotpRequest, ResendOtpRequest, LoginRequest, ForgotPasswordRequest, SavePasswordRequest
from src.database.connection import get_users_db, get_auth_db
from src.utils.mail import send_mail_otp
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import datetime

router = APIRouter()

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

from src.utils.auth import hash_password
from src.utils.jwt import create_jwt, verify_jwt
from src.config.config import otp_expiration_time
from src.models.user import Student
from src.models.auth import Otp
from src.schemas.request import StudentSignupRequest
from src.database.connection import get_users_db
from src.utils.mail import send_mail_otp
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import datetime

router = APIRouter()

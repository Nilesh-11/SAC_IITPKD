from src.database.connection import BaseAuth
from src.config.config import otp_expiration_time, password_expiration_time
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum
import datetime
import enum
import uuid

class OtpTypeEnum(enum.Enum):
    email = "email"
    sms = "sms"

class Otp(BaseAuth):
    __tablename__ = "otp"
    
    id = Column(Integer, primary_key=True, index=True)
    otp_code = Column(String, nullable=False)
    otp_type = Column(Enum(OtpTypeEnum, name="otp_type_enum"), nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow())
    exp_time = Column(DateTime, default=lambda: datetime.datetime.utcnow() + otp_expiration_time)
    attempts = Column(Integer, default=0)
    resend_count = Column(Integer, default=0)
    verified_at = Column(DateTime, nullable=True)
    lock_until = Column(DateTime, nullable=True)
    ip_addr = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    name = Column(String, nullable=False)
    full_name = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)

class ForgotPassword(BaseAuth):
    __tablename__ = "forgot_password"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False, index=True)
    token = Column(String, nullable=False, unique=True, default=lambda: str(uuid.uuid4()))
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime, default=lambda: datetime.datetime.utcnow() + password_expiration_time)
    used_at = Column(DateTime, nullable=True)
    ip_addr = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
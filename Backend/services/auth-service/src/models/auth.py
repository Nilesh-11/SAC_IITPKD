from src.database.connection import BaseAuth
from src.config.config import otp_expiration_time
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum
import datetime
import enum

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
    name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
from pydantic import BaseModel, Field, field_validator, EmailStr
from src.utils.sanitation import validate_password, validate_mail
from typing import Optional

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=50)
    
    @field_validator("new_password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return validate_password(value)

class AddClubRequest(BaseModel):
    email: EmailStr
    
    @field_validator("email")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class ResendOtpRequest(BaseModel):
    email:EmailStr
    ip_addr: Optional[str] = None
    user_agent: Optional[str] = None
    
    @field_validator("email")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class VerifyotpRequest(BaseModel):
    otp_code: str = Field(..., min_length=6, max_length=6, pattern="^[0-9]+$")
    email: EmailStr
    
    @field_validator("email")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class StudentSignupRequest(BaseModel):
    name: str = Field(..., min_length=3, max_length=30, pattern="^[a-zA-Z]+$")
    password: str = Field(..., min_length=8, max_length=50)
    full_name: str = Field(..., pattern=r"^[a-zA-Z]+(?: [a-zA-Z]+)*$")
    email: EmailStr
    ip_addr: Optional[str] = None
    user_agent: Optional[str] = None
    
    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return validate_password(value)
    
    @field_validator("email")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=50)

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return validate_password(value)
    
    @field_validator("email")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    ip_addr: Optional[str] = None
    user_agent: Optional[str] = None
    
    @field_validator("email")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class SavePasswordRequest(BaseModel):
    email: EmailStr
    password: str
    token: str
    ip_addr: Optional[str] = None
    user_agent: Optional[str] = None
    
    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return validate_password(value)
    
    @field_validator("email")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

from src.utils.verify import validate_mail
from pydantic import BaseModel, field_validator, EmailStr
from datetime import timedelta, datetime
from typing import Optional


class MyEventRequest(BaseModel):
    request_by: EmailStr

    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)
    

class AddEventRequest(BaseModel):
    organizer: EmailStr
    title: str
    description: str
    start_time: datetime
    end_time: datetime
    venue: str
    request_by: EmailStr

    @field_validator("organizer")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        if value is None:
            return True
        return validate_mail(value)
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class GetEventsRequest(BaseModel):
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class GetEventRequest(BaseModel):
    request_by: EmailStr
    id: int
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class UpdateEventRequest(BaseModel):
    id: int
    organizer: EmailStr
    title: str
    description: str
    start_time: datetime
    end_time: datetime
    venue: str
    request_by: EmailStr
    
    @field_validator("organizer")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)
    
class DeleteEventRequest(BaseModel):
    request_by: EmailStr
    id: int
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)
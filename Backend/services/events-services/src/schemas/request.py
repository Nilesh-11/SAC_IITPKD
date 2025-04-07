from src.utils.verify import validate_mail
from pydantic import BaseModel, field_validator, EmailStr
from datetime import date, time, timedelta, datetime

class AddEventRequest(BaseModel):
    request_by: EmailStr
    organizer: EmailStr
    title: str
    description: str
    event_timestamp: datetime
    venue: str
    duration: timedelta
    
    @field_validator("organizer")
    @classmethod
    def validate_mail(cls, value: str) -> str:
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
    request_by: EmailStr
    id: int
    organizer: EmailStr
    title: str
    description: str
    event_timestamp: datetime
    venue: str
    duration: timedelta
    
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
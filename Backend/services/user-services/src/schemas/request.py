from src.utils.verify import validate_mail
from pydantic import BaseModel, field_validator, EmailStr
from typing import Optional, List
from datetime import date, time, timedelta

class AddProjectRequest(BaseModel):
    proj_type: str
    member_roles: List[str]
    proj_domain: str
    title: str
    description: str
    start_date: date
    duration: timedelta
    skills: Optional[List[str]]
    status: str
    max_members_count: int
    current_members_count: int
    request_by: EmailStr

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
    event_date: date
    event_time: time
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

class AddClubRequest(BaseModel):
    name: str
    email: EmailStr
    password_hash: str
    faculty_advisor: EmailStr
    head: Optional[List[str]] = None
    coheads: Optional[List[str]] = None
    leads: Optional[List[str]] = None
    members: Optional[List[str]] = None
    website: Optional[str] = None
    council_id: int
    
    @field_validator("email")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)
    
    @field_validator("faculty_advisor")
    @classmethod
    def validate_faculty_mail(cls, value: str) -> str:
        return validate_mail(value)
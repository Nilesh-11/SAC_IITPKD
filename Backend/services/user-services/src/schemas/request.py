from src.utils.verify import validate_mail
from pydantic import BaseModel, field_validator, EmailStr, Field
from typing import Optional, List
from datetime import date, time, timedelta, datetime
from src.models.public import AnnouncementPriority

class DeleteCouncilRequest(BaseModel):
    id: int
    request_by: EmailStr

class AddCouncilRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    description: str
    faculty_advisor: str
    secretary: str
    deputy: Optional[List[str]]
    request_by: EmailStr

class AddClubRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    faculty_advisor: str
    head: str
    coheads: Optional[List[str]]
    request_by: EmailStr

class AddAnnouncementRequest(BaseModel):
    title: str = Field(..., max_length=255)
    body: str
    expires_at: datetime
    priority: Optional[AnnouncementPriority] = AnnouncementPriority.normal
    request_by: EmailStr

class UpdateAnnouncementRequest(BaseModel):
    id: int
    title: str = Field(..., max_length=255)
    body: str
    expires_at: datetime
    priority: Optional[AnnouncementPriority] = AnnouncementPriority.normal
    request_by: EmailStr

class DeleteAnnouncementRequest(BaseModel):
    id: int
    request_by: EmailStr

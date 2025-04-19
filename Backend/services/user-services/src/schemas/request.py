from src.utils.verify import validate_mail
from pydantic import BaseModel, field_validator, EmailStr, Field
from typing import Optional, List
from datetime import date, time, timedelta, datetime
from src.models.public import AnnouncementPriority


class ClubInfoRequest(BaseModel):
    club_id: int
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class UpdateRolesRequest(BaseModel):
    role_id: int
    title: str
    privilege: int = Field(..., ge=5, le=80)
    description: str
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class AddRolesRequest(BaseModel):
    title: str
    privilege: int = Field(..., ge=5, le=80)
    description: str
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class MembersListRequest(BaseModel):
    request_by: EmailStr

    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class UpdateMembershipRequest(BaseModel):
    email: EmailStr
    role: str
    request_by: EmailStr

    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)
    
    @field_validator("email")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class JoinClubRequest(BaseModel):
    club_id: int
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class DeleteCouncilRequest(BaseModel):
    id: int
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class UpdateClubRequest(BaseModel):
    name: str
    title: str
    email: EmailStr
    description: str
    password: str
    faculty_advisor: str
    head: str
    coheads: Optional[List[str]]
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)
    
    @field_validator("head")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)
    
    @field_validator("coheads")
    @classmethod
    def validate_coheads(cls, values: Optional[List[str]]) -> Optional[List[str]]:
        if values:
            for value in values:
                validate_mail(value)
        return values

class AddCouncilRequest(BaseModel):
    email: EmailStr
    name: str
    title: str
    password: str
    description: str
    faculty_advisor: str
    secretary: str
    deputy: Optional[List[str]]
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class DeleteClubRequest(BaseModel):
    club_id: int
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class AddClubRequest(BaseModel):
    name: str
    title: str
    description: str
    email: EmailStr
    password: str
    faculty_advisor: str
    head: str
    coheads: Optional[List[str]]
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)
    
    @field_validator("head")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)
    
    @field_validator("coheads")
    @classmethod
    def validate_coheads(cls, values: Optional[List[str]]) -> Optional[List[str]]:
        if values:
            for value in values:
                validate_mail(value)
        return values

class AddAnnouncementRequest(BaseModel):
    title: str = Field(..., max_length=255)
    body: str
    priority: Optional[AnnouncementPriority] = AnnouncementPriority.normal
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class UpdateAnnouncementRequest(BaseModel):
    id: int
    title: str = Field(..., max_length=255)
    body: str
    expires_at: datetime
    priority: Optional[AnnouncementPriority] = AnnouncementPriority.normal
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class DeleteAnnouncementRequest(BaseModel):
    id: int
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)
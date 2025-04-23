from src.utils.verify import validate_mail, validate_password
from pydantic import BaseModel, field_validator, EmailStr, Field
from typing import Optional, List
from datetime import date, time, timedelta, datetime
from src.models.public import AnnouncementPriority

class AddStudentRequest(BaseModel):
    name: str = Field(..., min_length=3, max_length=30, pattern="^[a-zA-Z]+$")
    full_name: str = Field(..., pattern=r"^[a-zA-Z]+(?: [a-zA-Z]+)*$")
    password: str = Field(..., min_length=8, max_length=50)
    email: EmailStr
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)
    
    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return validate_password(value)

class ClubInfoRequest(BaseModel):
    club_id: int
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class MemberInfoRequest(BaseModel):
    student_mail: EmailStr
    request_by: EmailStr

    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)
    
    @field_validator("student_mail")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)


class RolesListRequest(BaseModel):
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class DeleteRoleRequest(BaseModel):
    role_id: int
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
    title: str = Field(..., pattern=r"^[a-zA-Z]+(?: [a-zA-Z]+)*$")
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

class CouncilListRequest(BaseModel):
    request_by: str
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class AddCouncilRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=50)
    name: str = Field(..., min_length=3, max_length=30, pattern="^[a-zA-Z]+$")
    title: str = Field(..., pattern=r"^[a-zA-Z]+(?: [a-zA-Z]+)*$")
    description: str
    faculty_advisor: Optional[str]
    secretary: str
    deputy: Optional[List[str]]
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)
    
    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return validate_password(value)

class UpdateCouncilRequest(BaseModel):
    council_id: int
    email: str
    password: str = Field(..., min_length=8, max_length=50)
    name: str
    title: str
    description: str
    faculty_advisor: Optional[str]
    secretary: str
    deputy: Optional[List[str]]
    request_by: str
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)
    
    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return validate_password(value)

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
    password: str = Field(..., min_length=8, max_length=50)
    faculty_advisor: str
    head: str
    coheads: Optional[List[str]]
    request_by: EmailStr
    
    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return validate_password(value)
    
    @field_validator("email")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)
    
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

class ClubListRequest(BaseModel):
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
    name: str = Field(..., min_length=3, max_length=30, pattern="^[a-zA-Z]+$")
    title: str = Field(..., pattern=r"^[a-zA-Z]+(?: [a-zA-Z]+)*$")
    description: str
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=50)
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

class UsernameRequest(BaseModel):
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

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
    title: str = Field(..., pattern=r"^[a-zA-Z]+(?: [a-zA-Z]+)*$")
    body: str
    expires_at: datetime
    priority: Optional[AnnouncementPriority] = AnnouncementPriority.normal
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class OwnAnnouncementRequest(BaseModel):
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
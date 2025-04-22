from src.utils.verify import validate_mail
from pydantic import BaseModel, field_validator, EmailStr
from typing import Optional, List
from datetime import date, timedelta, datetime
from src.models.projects import MeetingType

class AddProjectRequest(BaseModel):
    proj_type: str
    member_roles: List[str]
    proj_domain: str
    title: str
    description: str
    start_date: date
    end_date: date
    skills: List[str]
    max_members_count: int
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class ShortlistRequest(BaseModel):
    participant_id: int
    project_id: int
    is_approved: bool
    role: str
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class MyProjectsRequest(BaseModel):
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class GetProjectsRequest(BaseModel):
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class GetProjectRequest(BaseModel):
    request_by: EmailStr
    id: int
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class UpdateProjectRequest(BaseModel):
    id: int
    proj_type: str
    member_roles: List[str]
    proj_domain: str
    title: str
    description: str
    start_date: date
    end_date: date
    skills: Optional[List[str]]
    max_members_count: int
    request_by: EmailStr
    
    @field_validator("organizer")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class DeleteProjectRequest(BaseModel):
    id: int
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class ApplyProjectRequest(BaseModel):
    project_id: int
    roles: List[str]
    skills: List[str]
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)
    
class UpdateApplicationRequest(BaseModel):
    project_id: int
    request_by: EmailStr
    roles: List[str]
    skills: List[str]
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)
    
class WithdrawApplicationRequest(BaseModel):
    project_id: int
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class RemoveApplicationRequest(BaseModel):
    project_id: int
    member: EmailStr
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)
    
    @field_validator("member")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class AddMeetingRequest(BaseModel):
    project_id: int
    title: str
    description: str
    meeting_type: MeetingType 
    scheduled_at: datetime
    venue: Optional[str]
    meeting_link: Optional[str]
    roles: List[str]
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class DeleteMeetingRequest(BaseModel):
    project_id: int
    meeting_id: int
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class UpdateMeetingRequest(BaseModel):
    meeting_id: int
    project_id: int
    title: str
    description: str
    meeting_type: MeetingType 
    scheduled_at: datetime
    venue: Optional[str]
    meeting_link: Optional[str]
    roles: List[str]
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class ProjectInfoRequest(BaseModel):
    project_id: int
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)


class OwnProjectsRequest(BaseModel):
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)

class MeetingReminderRequest(BaseModel):
    meeting_id: int
    request_by: EmailStr
    
    @field_validator("request_by")
    @classmethod
    def validate_mail(cls, value: str) -> str:
        return validate_mail(value)
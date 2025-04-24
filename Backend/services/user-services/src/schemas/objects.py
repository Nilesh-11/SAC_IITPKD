from pydantic import BaseModel

class CoreTeamMember(BaseModel):
    user_id: int
    name: str
    email: str
    role_title: str
    role_privilege: int
    club_name: str
from pydantic import BaseModel, ConfigDict

class AuthRequest(BaseModel):
    model_config = ConfigDict(extra="allow")

class EventsRequest(BaseModel):
    model_config = ConfigDict(extra="allow")
    token: str
    
class ProjectsRequest(BaseModel):
    model_config = ConfigDict(extra="allow")
    token: str

class UsersRequest(BaseModel):
    model_config = ConfigDict(extra="allow")
    token: str
    
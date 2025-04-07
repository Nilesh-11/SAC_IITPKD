from src.schemas.request import GetEventsRequest, GetEventRequest, UpdateEventRequest, DeleteEventRequest, AddProjectRequest
from src.utils.verify import verify_user
from src.models.projects import Project
from src.database.connection import get_projects_db
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import datetime

router = APIRouter()

@router.post("/club/add")
def add_club():
    
    pass
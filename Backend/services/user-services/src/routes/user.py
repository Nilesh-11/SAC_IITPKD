from src.schemas.request import GetEventsRequest, GetEventRequest, UpdateEventRequest, DeleteEventRequest, AddProjectRequest, AddClubRequest
from src.utils.verify import verify_user
from src.models.projects import Project
from src.models.users import Club
from src.database.connection import get_projects_db, get_users_db
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import datetime

router = APIRouter()

@router.post("/club/add")
def add_club(request: AddClubRequest, db: Session = Depends(get_users_db)):
    try:
        # Check if club with same email already exists
        existing_club = db.query(Club).filter(Club.email == request.email).first()
        if existing_club:
            raise HTTPException(status_code=400, detail="Club with this email already exists")
        
        # Create new club
        new_club = Club(
            name=request.name,
            email=request.email,
            password_hash=request.password_hash,
            faculty_advisor=request.faculty_advisor,
            head=request.head,
            coheads=request.coheads,
            leads=request.leads,
            members=request.members,
            website=request.website,
            council_id=request.council_id
        )
        
        db.add(new_club)
        db.commit()
        db.refresh(new_club)
        
        return JSONResponse(
            status_code=201,
            content={"message": "Club created successfully", "club_id": new_club.id}
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
from src.schemas.request import DeleteAnnouncementRequest, AddAnnouncementRequest, UpdateAnnouncementRequest
from src.utils.verify import verify_user
from src.models.projects import Project
from src.models.public import Announcements
from src.database.connection import get_public_db
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import datetime

router = APIRouter()

@router.post("/announcement/add")
def add_announcment(request: AddAnnouncementRequest, db: Session = Depends(get_public_db)):
    title=request.title
    body=request.body
    priority=request.priority
    request_by = request.request_by
    try:
        new_announcement = Announcements(
            title=title,
            body=body,
            created_at=datetime.datetime.utcnow(),
            updated_at=datetime.datetime.utcnow(),
            expires_at=datetime.datetime.utcnow() + datetime.timedelta(days=30),
            priority=priority,
            author=request_by
        )
        db.add(new_announcement)
        db.commit()
        return {'content': {'type':"ok", 'details': "Announcement added"}}
    except Exception as e:
        print("ERROR in add announcement:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}
    
@router.post("/announcement/update")
def add_announcment(request: UpdateAnnouncementRequest, db: Session = Depends(get_public_db)):
    id=request.id
    title=request.title
    body=request.body
    priority=request.priority
    request_by = request.request_by
    try:
        existing_announcement = db.query(Announcements).filter(Announcements.id == id).first()
        if not existing_announcement:
            return {'content': {'type':"error", 'details': "Announcement not found"}}
        if existing_announcement.author != request_by:
            return {'content': {'type':"error", 'details': "Unauthorized"}}
        existing_announcement.title=title
        existing_announcement.body=body
        existing_announcement.updated_at=datetime.datetime.utcnow()
        existing_announcement.expires_at=datetime.datetime.utcnow() + datetime.timedelta(days=30)
        existing_announcement.priority=priority
        db.commit()
        db.refresh(existing_announcement)
        return {'content': {'type':"ok", 'details': "Announcement updated",'id': existing_announcement.id}}
    except Exception as e:
        print("ERROR in add announcement:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/announcement/delete")
def add_announcment(request: DeleteAnnouncementRequest, db: Session = Depends(get_public_db)):
    id=request.id
    request_by = request.request_by
    try:
        existing_announcement = db.query(Announcements).filter(Announcements.id == id).first()
        if not existing_announcement:
            return {'content': {'type':"error", 'details': "Announcement not found"}}
        if existing_announcement.author != request_by:
            return {'content': {'type':"error", 'details': "Unauthorized"}}
        db.delete(existing_announcement)
        db.commit()
        return {'content': {'type':"ok", 'details': "Announcement updated",'id': existing_announcement.id}}
    except Exception as e:
        print("ERROR in add announcement:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}
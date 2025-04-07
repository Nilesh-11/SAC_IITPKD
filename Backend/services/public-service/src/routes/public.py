from src.schemas.request import AnnoncementListRequest, EventsListRequest
from src.models.public import Announcements
from src.models.events import Event
from src.database.connection import get_events_db, get_public_db
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/announcements/list")
def add_project(data: AnnoncementListRequest, db: Session = Depends(get_public_db)):
    try:
        existing_announcements = db.query(Announcements.id,
                                          Announcements.title,
                                          Announcements.body,
                                          Announcements.priority,
                                          ).filter(Announcements.is_expired == False).order_by(Announcements.created_at).all()
        return {'content':{'type': "ok", 'announcements': existing_announcements}}
    except Exception as e:
        print("ERROR in add event:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/events/list")
def get_projects(data: EventsListRequest, db: Session = Depends(get_events_db)):
    try:
        existing_events = db.query(Event.organizer,
                                   Event.title,
                                   Event.description,
                                   Event.event_timestamp).filter(Event.cancelled == False).all()
        return {'content':{'type': "ok", 'events': existing_events}}
    except Exception as e:
        print("ERROR in add event:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

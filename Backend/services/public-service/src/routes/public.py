from src.schemas.request import AnnouncementListRequest, EventsListRequest
from src.models.public import Announcements
from src.models.users import Council
from src.models.events import Event
from src.database.connection import get_events_db, get_public_db, get_users_db
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter()

def get_council_data(db: Session, council_name: str):
    try:
        council = db.query(Council).filter(Council.name == council_name).first()
        if not council:
            return {'content': {'type': "error", 'details': "Council not found"}}

        secretary_data = {
            "name": council.secretary.name,
            "full_name": council.secretary.full_name,
            "email": council.secretary.email
        } if council.secretary else None

        deputies_data = [{
            "name": deputy.name,
            "full_name": deputy.full_name,
            "email": deputy.email
        } for deputy in council.deputy_ids]

        return {'content': {
            'type': "ok",
            'council': {
                "secretary": secretary_data,
                "deputies": deputies_data,
                "council_name": council.name,
                "council_email": council.email,
                "council_title": council.title
            }
        }}
    except Exception as e:
        print(f"Error in {council_name} endpoint:", e)
        return {'content': {'type': "error", 'details': "An error occurred"}}

@router.post("/technical")
def technical_council(db: Session = Depends(get_users_db)):
    return get_council_data(db, "technical")

@router.post("/academic")
def academic_council(db: Session = Depends(get_users_db)):
    return get_council_data(db, "academic")

@router.post("/postgraduate")
def postgraduate_council(db: Session = Depends(get_users_db)):
    return get_council_data(db, "postgraduate")

@router.post("/research")
def research_council(db: Session = Depends(get_users_db)):
    return get_council_data(db, "research")

@router.post("/cultural")
def cultural_council(db: Session = Depends(get_users_db)):
    return get_council_data(db, "cultural")

@router.post("/hostel")
def hostel_council(db: Session = Depends(get_users_db)):
    return get_council_data(db, "hostel")

@router.post("/sports")
def sports_council(db: Session = Depends(get_users_db)):
    return get_council_data(db, "sports")

@router.post("/announcements/list")
def add_project(data: AnnouncementListRequest, db: Session = Depends(get_public_db)):
    try:
        existing_announcements = db.query(Announcements.id,
                                          Announcements.title,
                                          Announcements.body,
                                          Announcements.priority,
                                          Announcements.created_at,
                                          Announcements.author,
                                          Announcements.author_role,
                                          ).filter(Announcements.is_expired == False).order_by(Announcements.created_at).all()
        announcements_list = [dict(row._mapping) for row in existing_announcements]
        return {'content':{'type': "ok", 'announcements': announcements_list}}
    except Exception as e:
        print("ERROR in add event:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/events/list")
def get_projects(data: EventsListRequest, db: Session = Depends(get_events_db)):
    try:
        existing_events = db.query(Event.organizer,
                                   Event.title,
                                   Event.description,
                                   Event.start_time,
                                   Event.council).filter(Event.cancelled == False).all()
        events_list = [dict(row._mapping) for row in existing_events]
        return {'content':{'type': "ok", 'events': events_list}}
    except Exception as e:
        print("ERROR in add event:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

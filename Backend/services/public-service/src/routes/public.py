from src.schemas.request import CouncilInfoRequest, ClubListRequest, AnnouncementListRequest, EventsListRequest
from src.models.public import Announcements
from src.models.users import Council, Club, Student, Admin
from src.models.projects import Project
from src.models.events import Event
from src.database.connection import get_events_db, get_public_db, get_users_db, get_projects_db
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
import datetime
from enum import Enum

router = APIRouter()

def get_council_data(db: Session, council_name: str):
    try:
        council = db.query(Council).filter(Council.name == council_name).first()
        if not council:
            return JSONResponse(content={'type': "error", 'details': "Council not found"})

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

        return JSONResponse(content={
            'type': "ok",
            'council': {
                "secretary": secretary_data,
                "deputies": deputies_data,
                "council_name": council.name,
                "council_email": council.email,
                "council_title": council.title
            }
        })
    except Exception as e:
        print(f"Error in {council_name} endpoint:", e)
        return JSONResponse(content={'type': "error", 'details': "An error occurred"})

@router.post("/technical")
def technical_council(data: CouncilInfoRequest, db: Session = Depends(get_users_db)):
    return get_council_data(db, "technical")

@router.post("/academic")
def academic_council(data: CouncilInfoRequest, db: Session = Depends(get_users_db)):
    return get_council_data(db, "academic")

@router.post("/postgraduate")
def postgraduate_council(data: CouncilInfoRequest, db: Session = Depends(get_users_db)):
    return get_council_data(db, "postgraduate")

@router.post("/research")
def research_council(data: CouncilInfoRequest, db: Session = Depends(get_users_db)):
    return get_council_data(db, "research")

@router.post("/cultural")
def cultural_council(data: CouncilInfoRequest, db: Session = Depends(get_users_db)):
    return get_council_data(db, "cultural")

@router.post("/hostel")
def hostel_council(data: CouncilInfoRequest, db: Session = Depends(get_users_db)):
    return get_council_data(db, "hostel")

@router.post("/sports")
def sports_council(data: CouncilInfoRequest, db: Session = Depends(get_users_db)):
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
        announcements_list = []
        for row in existing_announcements:
            announcement = dict(row._mapping)
            if isinstance(announcement['created_at'], datetime.datetime):
                announcement['created_at'] = announcement['created_at'].isoformat()
            if isinstance(announcement['priority'], Enum):
                announcement['priority'] = announcement['priority'].value
            if isinstance(announcement['author_role'], Enum):
                announcement['author_role'] = announcement['author_role'].value
            announcements_list.append(announcement)
        return JSONResponse(content={'type': "ok", 'announcements': announcements_list})
    except Exception as e:
        print("ERROR in add event:", e)
        return JSONResponse(content={'type': "error", 'details': "An error occurred"})

@router.post("/events/list")
def get_events(data: EventsListRequest, 
                db_events: Session = Depends(get_events_db),
                db_users: Session = Depends(get_users_db)):
    try:
        existing_events = db_events.query(
            Event.organizer,
            Event.title,
            Event.description,
            Event.start_time,
            Event.end_time,
            Event.council
        ).filter(Event.cancelled == False).all()
        
        events_list = []
        for row in existing_events:
            event = dict(row._mapping)
            for time_field in ['start_time', 'end_time']:
                if isinstance(event[time_field], datetime.datetime):
                    event[time_field] = event[time_field].isoformat()
            events_list.append(event)

        council_names = {event['council'] for event in events_list}
        councils = db_users.query(Council.name, Council.title)\
                        .filter(Council.name.in_(council_names))\
                        .all()
        council_map = {c.name: c.title for c in councils}

        for event in events_list:
            council_name = event['council']
            event['council_name'] = council_name
            event['council_title'] = council_map.get(council_name, "No Title Found")

        return JSONResponse(content={'type': "ok", 'events': events_list})
    except Exception as e:
        print("ERROR retrieving events:", e)
        return JSONResponse(content={'type': "error", 'details': "An error occurred"})

@router.post("/clubs/list")
def clubs_list(request: ClubListRequest, db: Session = Depends(get_users_db)):
    try:
        clubs = db.query(Club).options(
            joinedload(Club.council)
        ).all()
        clubs_data = []
        for club in clubs:
            clubs_data.append({
                "id": club.id,
                "name": club.name,
                "title": club.title,
                "email": club.email,
                "council_name": club.council.title if club.council else None
            })
        return JSONResponse(content={
            'type': 'ok',
            'details': f"Found {len(clubs)} clubs",
            'clubs': clubs_data
        })
    except Exception as e:
        print(f"ERROR retrieving clubs: {e}")
        return JSONResponse(content={'type': 'error', 'details': 'Failed to retrieve clubs'})

@router.post("/status")
def get_status(
    users_db: Session = Depends(get_users_db),
    projects_db: Session = Depends(get_projects_db),
    events_db: Session = Depends(get_events_db)
):
    try:
        clubs_count = users_db.query(Club).count()
        events_count = events_db.query(Event).count()
        members_count = users_db.query(Student).count()
        
        today = datetime.datetime.today().date()
        ongoing_projects = projects_db.query(Project).filter(
            Project.start_date <= today,
            Project.end_date > today
        ).count()
        
        completed_projects = projects_db.query(Project).filter(
            Project.end_date < today
        ).count()

        status_data = [
            {"title": "Clubs", "count": clubs_count},
            {"title": "Events", "count": events_count},
            {"title": "Ongoing Projects", "count": ongoing_projects},
            {"title": "Projects Completed", "count": completed_projects},
            {"title": "members registered", "count": members_count},
        ]

        return JSONResponse(content={
            'type': 'ok',
            'details': 'System status retrieved',
            'status': status_data
        })
    except Exception as e:
        print(f"ERROR retrieving system status: {e}")
        return JSONResponse(content={'type': 'error', 'details': 'Failed to retrieve system status'})

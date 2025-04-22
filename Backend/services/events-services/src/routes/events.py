from src.schemas.request import MyEventRequest, AddEventRequest, GetEventsRequest, GetEventRequest, UpdateEventRequest, DeleteEventRequest
from src.utils.verify import verify_user
from src.models.events import Event
from src.models.users import Club
from src.database.connection import get_events_db, get_users_db
from src.models.users import Student, Club, Council, Admin
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import exists
import datetime

router = APIRouter()

@router.post("/add")
def add_event(data: AddEventRequest, db: Session = Depends(get_events_db), db_user: Session = Depends(get_users_db)):
    organizer=data.organizer
    title=data.title
    description=data.description
    start_time=data.start_time
    end_time=data.end_time
    venue=data.venue
    request_by=data.request_by

    try:
        if start_time > end_time:
            return {'content':{'type': "error", "details": "Start time is greater than end time"}}
        existing_request_by_type =  verify_user(request_by, db_user)
        if existing_request_by_type not in ["club", "council"]:
            return {'content':{'type': "error", "details": "User is not a club or a council"}}
        if existing_request_by_type == "council":
            existing_request_by = db_user.query(Council).filter(Council.email == request_by).first()
        else:
            existing_request_by = db_user.query(Club).filter(Club.email == request_by).first()
        existing_organizer = db_user.query(exists().where(Student.email == organizer)).scalar()
        if not existing_organizer:
            return {'content':{'type': "error", "details": "Organizer is not registered on sac website or is not a student"}}
        new_event = Event(
            organizer=organizer,
            title=title,
            description=description,
            start_time=start_time,
            end_time=end_time,
            venue=venue,
            registered_by=request_by,
            council= existing_request_by.name if existing_request_by_type == "council" else existing_request_by.council.name
        )
        db.add(new_event)
        db.commit()
        db.refresh(new_event)
        return {'content':{'type': "ok", 'id': new_event.id, 'details': "New event added"}}
    except Exception as e:
        print("ERROR in add event:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/list")
def get_events(data: GetEventsRequest, db: Session = Depends(get_events_db)):
    try:
        all_events = db.query(Event).filter(Event.start_time >= datetime.datetime.utcnow() - datetime.timedelta(days=25)).all()
        return {'content':{'type': "ok", 'events': all_events}}
    except Exception as e:
        print("ERROR in events list:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/my")
def get_own_events(data: MyEventRequest, 
                  db: Session = Depends(get_events_db),
                  db_user: Session = Depends(get_users_db)):
    try:
        if not verify_user(data.request_by, db_user):
            return {'content': {'type': 'error', 'details': 'Unauthorized user'}}

        events = db.query(Event).filter(
            Event.registered_by == data.request_by
        ).order_by(Event.start_time.desc()).all()

        formatted_events = []
        current_time = datetime.datetime.utcnow()
        
        for event in events:
            if current_time < event.start_time:
                status = "upcoming"
            elif event.start_time <= current_time < event.end_time:
                status = "ongoing"
            else:
                status = "completed"

            formatted_events.append({
                "id": event.id,
                "title": event.title,
                "organizer": event.organizer,
                "description": event.description,
                "start_time": event.start_time.isoformat(),
                "end_time": event.end_time.isoformat(),
                "venue": event.venue,
                "council": event.council,
                "status": status,
                "cancelled": event.cancelled,
                "registered_by": event.registered_by
            })

        return {
            'content': {
                'type': 'ok',
                'details': f"Found {len(formatted_events)} events",
                'events': formatted_events
            }
        }
    except Exception as e:
        print(f"ERROR retrieving events: {e}")
        return {'content': {'type': 'error', 'details': 'Failed to retrieve events'}}

@router.post("/event")
def get_event(data: GetEventRequest, db: Session = Depends(get_events_db)):
    id = data.id
    try:
        event = db.query(Event).filter(Event.id == id).first()
        if not event:
            return {'content': {'type': "error", 'details': "Event not found"}}
        return {'content': {'type': "ok", 'events': event}}
    except Exception as e:
        print("ERROR in an event:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/update")
def update_event(data: UpdateEventRequest, db: Session = Depends(get_events_db)):
    id = data.id
    organizer=data.organizer
    title=data.title
    description=data.description
    start_time=data.start_time
    end_time=data.end_time
    venue=data.venue
    request_by=data.request_by
    try:
        existing_event = db.query(Event).filter(Event.id == id).first()
        if not existing_event:
            return {'content':{'type': 'error', 'details': 'Event not found'}}
        if existing_event.registered_by != request_by:
            return {'content':{'type': 'error', 'details': 'Unauthorized user'}}
        
        existing_event.organizer=organizer
        existing_event.title=title
        existing_event.description=description
        existing_event.start_time=start_time
        existing_event.end_time=end_time
        existing_event.venue=venue
        db.commit()
        return {'content':{'type': "ok", 'event': existing_event}}
    except Exception as e:
        print("ERROR in an updating event:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/delete")
def delete_event(data: DeleteEventRequest, db: Session = Depends(get_events_db)):
    request_by=data.request_by
    id = data.id
    try:
        existing_event = db.query(Event).filter(Event.id == id).first()
        if not existing_event:
            return {'content':{'type': 'error', 'details': 'Event not found'}}
        if existing_event.registered_by != request_by:
            return {'content':{'type': 'error', 'details': 'Unauthorized user'}}
        db.delete(existing_event)
        db.commit()
        return {'content':{'type': "ok", 'details': "Event successfully removed"}}
    except Exception as e:
        print("ERROR in an updating event:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

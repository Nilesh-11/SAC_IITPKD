from src.schemas.request import AddEventRequest, GetEventsRequest, GetEventRequest, UpdateEventRequest, DeleteEventRequest
from src.utils.verify import verify_user
from src.models.events import Event
from src.models.users import Club
from src.database.connection import get_events_db, get_users_db
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import datetime

router = APIRouter()

@router.post("/add")
def add_event(data: AddEventRequest, db: Session = Depends(get_events_db), db_user: Session = Depends(get_users_db)):

    organizer=data.organizer
    title=data.title
    description=data.description
    event_timestamp=data.event_timestamp
    duration=data.duration
    venue=data.venue
    request_by=data.request_by

    try:
        exisiting_club = db_user.query(Club).filter(Club.email == organizer).first()
        if not exisiting_club:
            return {'content':{'type': "error", "details": "Organizer is not registered on sac website"}}
        new_event = Event(
            organizer=organizer,
            title=title,
            description=description,
            event_timestamp=event_timestamp,
            duration=duration,
            venue=venue,
            registered_by=request_by
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
        all_events = db.query(Event).filter(Event.event_timestamp >= datetime.datetime.utcnow() - datetime.timedelta(days=25)).all()
        return {'content':{'type': "ok", 'events': all_events}}
    except Exception as e:
        print("ERROR in events list:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

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
    organizer=data.organizer
    title=data.title
    description=data.description
    event_timestamp=data.event_timestamp
    duration=data.duration
    venue=data.venue
    request_by=data.request_by
    id = data.id
    try:
        existing_event = db.query(Event).filter(Event.id == id).first()
        if not existing_event:
            return {'content':{'type': 'error', 'details': 'Event not found'}}
        if existing_event.registered_by != request_by:
            return {'content':{'type': 'error', 'details': 'Unauthorized user'}}
        
        existing_event.organizer=organizer
        existing_event.title=title
        existing_event.description=description
        existing_event.event_timestamp=event_timestamp
        existing_event.duration=duration
        existing_event.venue=venue

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
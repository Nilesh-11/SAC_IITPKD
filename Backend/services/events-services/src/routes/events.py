from src.schemas.request import MyEventRequest, AddEventRequest, GetEventsRequest, GetEventRequest, UpdateEventRequest, DeleteEventRequest
from src.utils.verify import verify_user
from src.database.connection import get_events_db, get_users_db
from src.models.events import Event
from src.models.users import Student, Club, Council
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
            return JSONResponse(content={"type": "error", "details": "Start time cannot be after end time"},
                                status_code=400)
        existing_request_by_type =  verify_user(request_by, db_user)
        if existing_request_by_type not in ["club", "council"]:
            return JSONResponse(content={"type": "error", "details": "Only clubs or councils can create events"},
                                status_code=403)
        if existing_request_by_type == "council":
            existing_request_by = db_user.query(Council).filter(Council.email == request_by).first()
        else:
            existing_request_by = db_user.query(Club).filter(Club.email == request_by).first()
        existing_organizer = db_user.query(exists().where(Student.email == organizer)).scalar()
        if not existing_organizer:
            return JSONResponse(content={"type": "error", "details": "Organizer must be a registered student"},
                                status_code=400)
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
        return JSONResponse(
            content={
                "type": "ok",
                "id": new_event.id,
                "details": "Event created successfully",
                "event": {
                    "title": new_event.title,
                    "start_time": new_event.start_time.isoformat(),
                    "end_time": new_event.end_time.isoformat()
                }
            }
        )
    except Exception as e:
        print("ERROR in add event:", e)
        return JSONResponse(content={"type": "error", "details": "Failed to create event"},
                            status_code=500)

@router.post("/list")
def get_events(data: GetEventsRequest, db: Session = Depends(get_events_db)):
    try:
        events = db.query(Event).filter(Event.start_time >= datetime.datetime.utcnow() - datetime.timedelta(days=25)).all()
        events_list = [{
            "id": e.id,
            "organizer": e.organizer,
            "title": e.title,
            "description": e.description,
            "start_time": e.start_time.isoformat(),
            "end_time": e.end_time.isoformat(),
            "venue": e.venue,
            "registered_by": e.registered_by,
            "council": e.council,
            "cancelled": e.cancelled
        } for e in events]
        
        return JSONResponse(
            content={
                "type": "ok",
                "events": events_list,
                "count": len(events_list)
            }
        )
        
    except Exception as e:
        print("ERROR in events list:", e)
        return JSONResponse(content={"type": "error", "details": "Failed to retrieve events"},
                            status_code=500)


@router.post("/my")
def get_own_events(data: MyEventRequest, 
                  db: Session = Depends(get_events_db),
                  db_user: Session = Depends(get_users_db)):
    try:
        if not verify_user(data.request_by, db_user):
            return JSONResponse(content={"type": "error", "details": "Unauthorized"},
                                status_code=401)

        events = db.query(Event).filter(
            Event.registered_by == data.request_by
        ).order_by(Event.start_time.desc()).all()

        formatted_events = []
        
        for event in events:

            formatted_events.append({
                "id": event.id,
                "title": event.title,
                "organizer": event.organizer,
                "description": event.description,
                "start_time": event.start_time.isoformat(),
                "end_time": event.end_time.isoformat(),
                "venue": event.venue,
                "council": event.council,
                "status": event.event_status,
                "cancelled": event.cancelled,
                "registered_by": event.registered_by
            })

        return JSONResponse(content={
                                "type": "ok",
                                "events": formatted_events,
                                "count": len(formatted_events)
                            })
    except Exception as e:
        print(f"ERROR retrieving events: {e}")
        return JSONResponse(content={"type": "error", "details": "Failed to retrieve events"},
                            status_code=500)

@router.post("/event")
def get_event(data: GetEventRequest, db: Session = Depends(get_events_db)):
    id = data.id
    try:
        event = db.query(Event).filter(Event.id == id).first()
        if not event:
            return JSONResponse(content={"type": "error", "details": "Event not found"},
                                status_code=404)
        return JSONResponse(content={
                                "type": "ok",
                                "event": {
                                    "id": event.id,
                                    "title": event.title,
                                    "organizer": event.organizer,
                                    "description": event.description,
                                    "start_time": event.start_time.isoformat(),
                                    "end_time": event.end_time.isoformat(),
                                    "venue": event.venue,
                                    "council": event.council,
                                    "cancelled": event.cancelled,
                                    "registered_by": event.registered_by
                                }
                            })
    except Exception as e:
        print("Error getting event:", e)
        return JSONResponse(content={"type": "error", "details": "Failed to retrieve event"},
                            status_code=500)

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
            return JSONResponse(content={"type": "error", "details": "Event not found"},
                                status_code=404)
        if existing_event.registered_by != request_by:
            return JSONResponse(content={"type": "error", "details": "Unauthorized"},
                                status_code=403)
        existing_event.organizer=organizer
        existing_event.title=title
        existing_event.description=description
        existing_event.start_time=start_time
        existing_event.end_time=end_time
        existing_event.venue=venue
        db.commit()
        return JSONResponse(
            content={
                "type": "ok",
                "details": "Event updated successfully",
                "event": {
                    "id": existing_event.id,
                    "title": existing_event.title
                }
            }
        )
    except Exception as e:
        print("Error updating event:", e)
        db.rollback()
        return JSONResponse(content={"type": "error", "details": "Failed to update event"},
                            status_code=500)

@router.post("/delete")
def delete_event(data: DeleteEventRequest, db: Session = Depends(get_events_db)):
    request_by=data.request_by
    id = data.id
    try:
        existing_event = db.query(Event).filter(Event.id == id).first()
        if not existing_event:
            return JSONResponse(content={"type": "error", "details": "Event not found"},
                                status_code=404)
        if existing_event.registered_by != request_by:
            return JSONResponse(content={"type": "error", "details": "Unauthorized"},
                                status_code=403)
        db.delete(existing_event)
        db.commit()
        return JSONResponse(content={"type": "ok","details": "Event deleted successfully"})
    except Exception as e:
        print("Error deleting event:", e)
        db.rollback()
        return JSONResponse(content={"type": "error", "details": "Failed to delete event"},status_code=500)

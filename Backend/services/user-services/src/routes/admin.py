from src.utils.auth import hash_password
from src.schemas.request import DeleteAnnouncementRequest, DeleteCouncilRequest, AddAnnouncementRequest, UpdateAnnouncementRequest, AddCouncilRequest
from src.utils.verify import verify_user
from src.models.public import Announcements
from src.models.users import Admin, Council, Student
from src.database.connection import get_public_db, get_users_db
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
            author=request_by,
            author_role="admin"
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
            author=request_by,
            author_role="admin"
        )
        db.add(new_announcement)
        db.commit()
        return {'content': {'type':"ok", 'details': "Announcement added"}}
    except Exception as e:
        print("ERROR in add announcement:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/councils/add")
def add_council(request: AddCouncilRequest, db: Session = Depends(get_users_db)):
    email=request.email
    password=request.password
    password_hash = hash_password(password)
    name=request.name
    title=request.title
    description=request.description
    faculty_advisor=request.faculty_advisor
    secretary=request.secretary
    deputy=request.deputy
    request_by = request.request_by
    try:
        existing_admin = db.query(Admin).filter(Admin.email == request_by).first()
        if not existing_admin:
            return {'content': {'type':"error", 'details': "Admin not found"}}
        existing_secretary = db.query(Student).filter(Student.email == secretary).first()
        if not existing_secretary:
            return {'content': {'type':"error", 'details': "Secretary not found"}}
        deputy_students = []
        for user in deputy:
            existing_deputy = db.query(Student).filter(Student.email == user).first()
            if not existing_deputy:
                return {'content': {'type':"error", 'details': "Deputy Secretary not found"}}
            deputy_students.append(existing_deputy)
        new_council = Council(
            email=email,
            password_hash=password_hash,
            name=name,
            title=title,
            description=description,
            faculty_advisor=faculty_advisor,
            secretary_id=existing_secretary.id,
            secretary=existing_secretary,
            deputy_ids=deputy_students
        )
        db.add(new_council)
        db.commit()
        db.refresh(new_council)
        return {'content': {'type':"ok", 'details': "Council added",'id': new_council.id}}
    except Exception as e:
        print("ERROR in add council:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/councils/delete")
def delete_council(request: DeleteCouncilRequest, db: Session = Depends(get_users_db)):
    id=request.id
    request_by=request.request_by
    try:
        existing_admin = db.query(Admin).filter(Admin.email == request_by).first()
        if not existing_admin:
            return {'content': {'type':"error", 'details': "Admin not found"}}
        existing_council = db.query(Council).filter(Council.id == id).first()
        if not existing_council:
            return {'content': {'type':"error", 'details': "Council not found"}}
        db.delete(existing_council)
        db.commit()
        return {'content': {'type':"ok", 'details': "Council deleted"}}
    except Exception as e:
        print("ERROR in add council:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}
    


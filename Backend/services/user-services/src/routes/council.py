from src.utils.auth import hash_password
from src.schemas.request import UpdateClubRequest, DeleteAnnouncementRequest, AddAnnouncementRequest, UpdateAnnouncementRequest, AddClubRequest
from src.utils.verify import verify_user
from src.models.projects import Project
from src.models.users import Council, Student, Club, Admin, ClubRole
from src.models.public import Announcements
from src.database.connection import get_users_db, get_public_db
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
            author_role="council"
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

@router.post("/clubs/add")
def add_club(request: AddClubRequest, db: Session = Depends(get_users_db)):
    name=request.name
    title=request.title
    email=request.email
    description=request.description
    password=request.password
    password_hash=hash_password(password)
    faculty_advisor=request.faculty_advisor
    head=request.head
    coheads=request.coheads
    request_by=request.request_by
    try:
        existing_council = db.query(Council).filter(Council.email == request_by).first()
        if not existing_council:
            return {'content': {'type':"error", 'details': "Council not found"}}
        existing_head = db.query(Student).filter(Student.email == head).first()
        if not existing_head:
            return {'content': {'type':"error", 'details': "Head not found"}}
        for cohead in coheads:
            existing_cohead = db.query(Student).filter(Student.email == cohead).first()
            if not existing_cohead:
                return {'content': {'type':"error", 'details': "CO-Head not found"}}
        new_club = Club(
            name=name,
            title=title,
            description=description,
            email=email,
            password_hash=password_hash,
            faculty_advisor=faculty_advisor,
            head=head,
            coheads=coheads,
            council_id=existing_council.id
        )
        db.add(new_club)
        db.commit()
        db.refresh(new_club)
        new_club_role = ClubRole(
            club_id=new_club.id,
            title="member",
            description="member of club",
            privilege=1
        )
        db.add(new_club_role)
        db.commit()
        return {'content': {'type':"ok", 'details': "Club created",'id': new_club.id}}
    except Exception as e:
        print("ERROR in add announcement:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/clubs/update")
def add_club(request: UpdateClubRequest, db: Session = Depends(get_users_db)):
    name=request.name
    title=request.title
    email=request.email
    description=request.description
    password=request.password
    password_hash=hash_password(password)
    faculty_advisor=request.faculty_advisor
    head=request.head
    coheads=request.coheads
    request_by=request.request_by
    try:
        existing_council = db.query(Council).filter(Council.email == request_by).first()
        if not existing_council:
            return {'content': {'type':"error", 'details': "Council not found"}}
        existing_head = db.query(Student).filter(Student.email == head).first()
        if not existing_head:
            return {'content': {'type':"error", 'details': "Head not found"}}
        for cohead in coheads:
            existing_cohead = db.query(Student).filter(Student.email == cohead).first()
            if not existing_cohead:
                return {'content': {'type':"error", 'details': "CO-Head not found"}}
        new_club = Club(
            name=name,
            title=title,
            description=description,
            email=email,
            password_hash=password_hash,
            faculty_advisor=faculty_advisor,
            head=head,
            coheads=coheads,
            council_id=existing_council.id
        )
        db.add(new_club)
        db.commit()
        db.refresh(new_club)
        new_club_role = ClubRole(
            club_id = new_club.id,
            title= "member",
            description = "member of club"
        )
        db.add(new_club_role)
        db.commit()
        return {'content': {'type':"ok", 'details': "Club created",'id': new_club.id}}
    except Exception as e:
        print("ERROR in add announcement:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

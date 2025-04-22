from src.schemas.request import OwnAnnouncementRequest, DeleteAnnouncementRequest, AddAnnouncementRequest, UpdateAnnouncementRequest, UsernameRequest
from src.routes import admin, student, council, club
from src.models.public import Announcements
from src.utils.auth import hash_password
from src.utils.verify import verify_user
from src.models.users import Student, Admin, Club, Council
from src.database.connection import get_users_db, get_projects_db, get_public_db, get_users_db
from src.database.connection import BaseUser, engine_user
import datetime
from fastapi import FastAPI
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

app = FastAPI(title="Projects Service")

BaseUser.metadata.create_all(bind=engine_user)

app.include_router(student.router, prefix="/student")
app.include_router(club.router, prefix="/club")
app.include_router(council.router, prefix="/council")
app.include_router(admin.router, prefix="/admin")

@app.get("/")
def health_check():
    return {"status": "Event Service is running"}

@app.post("/username")
def get_username(request: UsernameRequest, db: Session = Depends(get_users_db)):
    try:
        email = request.request_by
        student = db.query(Student).filter(Student.email == email).first()
        if student:
            return {
                'content': {
                    'type': 'ok',
                    'name': student.name,
                    'user_type': 'student'
                }
            }
        council = db.query(Council).filter(Council.email == email).first()
        if council:
            return {
                'content': {
                    'type': 'ok',
                    'name': council.name,
                    'user_type': 'council'
                }
            }
        club = db.query(Club).filter(Club.email == email).first()
        if club:
            return {
                'content': {
                    'type': 'ok',
                    'name': club.name,
                    'user_type': 'club'
                }
            }
        admin = db.query(Admin).filter(Admin.email == email).first()
        if admin:
            return {
                'content': {
                    'type': 'ok',
                    'name': admin.name,
                    'user_type': 'admin'
                }
            }
        return {
            'content': {
                'type': 'error',
                'details': 'No user found with this email'
            }
        }
    except Exception as e:
        print(f"ERROR retrieving username: {e}")
        return {
            'content': {
                'type': 'error',
                'details': 'Failed to retrieve username'
            }
        }

@app.post("/announcement/add")
def add_announcment(request: AddAnnouncementRequest, db: Session = Depends(get_public_db), db_user: Session = Depends(get_users_db)):
    title=request.title
    body=request.body
    priority=request.priority
    request_by=request.request_by
    try:
        author_role = verify_user(request_by, db_user)
        if not author_role or author_role not in ["admin", "council", "club"]: 
            return {'content': {'type': "error", "details": "Unauthorized User, critical!"}}
        new_announcement = Announcements(
            title=title,
            body=body,
            created_at=datetime.datetime.utcnow(),
            updated_at=datetime.datetime.utcnow(),
            expires_at=datetime.datetime.utcnow() + datetime.timedelta(days=30),
            priority=priority,
            author=request_by,
            author_role=author_role
        )
        db.add(new_announcement)
        db.commit()
        return {'content': {'type':"ok", 'details': "Announcement added"}}
    except Exception as e:
        print("ERROR in add announcement:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@app.post("/announcements/my")
def get_own_announcements(request: OwnAnnouncementRequest, 
                         db: Session = Depends(get_public_db),
                         db_user: Session = Depends(get_users_db)):
    try:
        author_role = verify_user(request.request_by, db_user)
        if not author_role:
            return {'content': {'type': "error", "details": "Unauthorized"}}

        announcements = db.query(Announcements)\
            .filter(Announcements.author == request.request_by)\
            .order_by(Announcements.created_at.desc())\
            .all()

        formatted_announcements = [{
            "id": ann.id,
            "title": ann.title,
            "body": ann.body,
            "priority": ann.priority,
            "created_at": ann.created_at.isoformat(),
            "updated_at": ann.updated_at.isoformat(),
            "expires_at": ann.expires_at.isoformat(),
            "status": "active" if ann.expires_at > datetime.datetime.utcnow() else "expired"
        } for ann in announcements]

        return {
            'content': {
                'type': "ok",
                'details': f"Found {len(formatted_announcements)} announcements",
                'announcements': formatted_announcements
            }
        }

    except Exception as e:
        print(f"ERROR retrieving announcements: {e}")
        return {'content': {'type': "error", 'details': "Failed to retrieve announcements"}}

@app.post("/announcement/update")
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

@app.post("/announcement/delete")
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

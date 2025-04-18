from src.schemas.request import AddRolesRequest, MembersListRequest, UpdateMembershipRequest, DeleteAnnouncementRequest, AddAnnouncementRequest, UpdateAnnouncementRequest
from src.utils.verify import verify_user
from src.models.projects import Project
from src.models.users import Student, Club, ClubMembership, ClubRole
from src.models.public import Announcements
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
            author_role="club"
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
        print("ERROR in delete announcement:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/roles/add")
def add_roles(data: AddRolesRequest, db: Session = Depends(get_users_db)):
    title=data.title
    description=data.description
    request_by=data.request_by
    try:
        existing_club = db.query(Club).filter(Club.email == request_by).first()
        if not existing_club:
            return {'content':{'type': "error", 'details': "Club not found"}}
        existing_role = db.query(ClubRole).filter(ClubRole.club_id == existing_club.id, ClubRole.title == title).first()
        if existing_role:
            return {'content':{'type': "error", 'details': "Role already exists"}}
        new_club_role = ClubRole(
            club_id=existing_club.id,
            title=title,
            description=description
        )
        db.add(new_club_role)
        db.commit()
        db.refresh(new_club_role)
        return {'content': {'type':"ok", 'details': "club updated",'id': new_club_role.id}}
    except Exception as e:
        print("ERROR in adding roles:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/roles/update")
def update_roles(data: AddRolesRequest, db: Session = Depends(get_users_db)):
    title=data.title
    description=data.description
    request_by=data.request_by
    try:
        existing_club = db.query(Club).filter(Club.email == request_by).first()
        if not existing_club:
            return {'content':{'type': "error", 'details': "Club not found"}}
        existing_role = db.query(ClubRole).filter(ClubRole.club_id == existing_club.id, ClubRole.title == title).first()
        if existing_role:
            return {'content':{'type': "error", 'details': "Role not found"}}
        existing_role.description = description
        db.commit()
        return {'content': {'type':"ok", 'details': "Role updated"}}
    except Exception as e:
        print("ERROR in updating roles:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/membership/update")
def join_club(data: UpdateMembershipRequest, db: Session = Depends(get_users_db)):
    student_id=data.id
    role=data.role
    request_by=data.request_by
    try:
        existing_club = db.query(Club).filter(Club.email == request_by).first()
        if not existing_club:
            return {'content':{'type': "error", 'details': "Club not found"}}
        existing_role = db.query(ClubRole).filter(ClubRole.club_id == existing_club.id, ClubRole.title == role).first()
        if not existing_role:
            return {'content':{'type': "error", 'details': "Role not found"}}
        existing_membership = db.query(ClubMembership)\
                                .filter(ClubMembership.student_id == student_id, ClubMembership.club_id == existing_club.id)\
                                .first()
        if not existing_membership:
            return {'content':{'type': "error", 'details': "Student membership not found"}}
        existing_membership.role=role
        db.commit()
        return {'content':{'type': "ok", 'details': "Club membership updated"}}
    except Exception as e:
        print("Error in membership update in:", e)
        return {'content':{"type": "error", "detail": "An error occurred with login", 'status_code': 500}}

@router.post("/members/list")
def join_club(data: MembersListRequest, db: Session = Depends(get_users_db)):
    request_by=data.request_by
    try:
        existing_club = db.query(Club).filter(Club.email == request_by).first()
        if not existing_club:
            return {'content':{'type': "error", 'details': "Unauthorized user"}}
        existing_membership = db.query(ClubMembership)\
                                .filter(ClubMembership.club_id == existing_club.id)\
                                .all()
        member_list = []
        for member in existing_membership:
            member_dict = {key: value for key, value in member.__dict__.items() if not key.startswith("_")}
            member_dict["name"] = member.student.name
            member_dict["email"] = member.student.email
            member_list.append(member_dict)
        db.commit()
        return {'content':{'type': "ok", 'details': "Fetched members list", 'members': member_list}}
    except Exception as e:
        print("Error in membership list:", e)
        return {'content':{"type": "error", "detail": "An error occurred with login", 'status_code': 500}}

# @router.post("/members/cleanup")
# def join_club(data: MembersResetRequest, db: Session = Depends(get_users_db)):
#     request_by=data.request_by
#     student_id=data.student_id
#     try:
#         existing_club = db.query(Club).filter(Club.email == request_by).first()
#         if not existing_club:
#             return {'content':{'type': "error", 'details': "Unauthorized user"}}
#         existing_membership = db.query(ClubMembership)\
#                                 .filter(ClubMembership.club_id == existing_club.id)\
#                                 .all()
#         member_list = []
#         for member in existing_membership:
#             member_dict = {key: value for key, value in member.__dict__.items() if not key.startswith("_")}
#             member_dict["name"] = member.student.name
#             member_dict["email"] = member.student.email
#             member_list.append(member_dict)
#         db.commit()
#         return {'content':{'type': "ok", 'details': "Fetched members list", 'members': member_list}}
#     except Exception as e:
#         print("Error in membership update in:", e)
#         return {'content':{"type": "error", "detail": "An error occurred with login", 'status_code': 500}}


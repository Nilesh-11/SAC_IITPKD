from src.schemas.request import UpdateRolesRequest, AddRolesRequest, MembersListRequest, UpdateMembershipRequest, DeleteAnnouncementRequest, AddAnnouncementRequest, UpdateAnnouncementRequest
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

@router.post("/role/add")
def add_roles(data: AddRolesRequest, db: Session = Depends(get_users_db)):
    title=data.title
    description=data.description
    privilege=data.privilege
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
            description=description,
            privilege=privilege
        )
        db.add(new_club_role)
        db.commit()
        db.refresh(new_club_role)
        return {'content': {'type':"ok", 'details': "club updated",'id': new_club_role.id}}
    except Exception as e:
        print("ERROR in adding roles:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/role/update")
def update_roles(data: UpdateRolesRequest, db: Session = Depends(get_users_db)):
    role_id = data.role_id
    title=data.title
    privilege=data.privilege
    description=data.description
    request_by=data.request_by
    try:
        existing_club = db.query(Club).filter(Club.email == request_by).first()
        if not existing_club:
            return {'content':{'type': "error", 'details': "Club not found"}}
        existing_role = db.query(ClubRole).filter(ClubRole.id == role_id, ClubRole.club_id == existing_club.id).first()
        if not existing_role:
            return {'content':{'type': "error", 'details': "Role not found"}}
        existing_role.title = title
        existing_role.description = description
        existing_role.privilege=privilege
        db.commit()
        return {'content': {'type':"ok", 'details': "Role updated"}}
    except Exception as e:
        print("ERROR in updating roles:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/membership/update")
def membership_update(data: UpdateMembershipRequest, db: Session = Depends(get_users_db)):
    student_email=data.email
    role=data.role
    request_by=data.request_by
    try:
        existing_club = db.query(Club).filter(Club.email == request_by).first()
        if not existing_club:
            return {'content':{'type': "error", 'details': "Club not found"}}
        existing_student = db.query(Student).filter(Student.email == student_email).first()
        if not existing_student:
            return {'content':{'type': "error", 'details': "Student not found"}}
        current_membership = db.query(ClubMembership)\
                                .join(ClubRole)\
                                .filter(ClubMembership.club_id == existing_club.id,
                                        ClubMembership.student_id == existing_student.id,
                                        ~ClubRole.title.startswith('ex-'))\
                                .first()
        if not current_membership:
            return {'content':{'type': "error", 'details': "Student membership not found"}}
        current_role = db.query(ClubRole).filter(ClubRole.id == current_membership.role_id).first()
        if not current_role:
            return {'content':{'type': "error", 'details': "Previous role not found"}}
        if current_role.privilege > 90:
            return {'content':{'type': "error", 'details': "Clubs do not have privilege for this operation contact council instead"}}
        if current_role.title == role:
            return {'content':{'type': "error", 'details': "Same role already"}}
        
        def ensure_ex_role(previous_role: ClubRole) -> ClubRole:
            clean_title = previous_role.title.replace("ex-", "")
            ex_role_title = f"ex-{clean_title}"
            ex_role = db.query(ClubRole).filter(
                ClubRole.club_id == existing_club.id,
                ClubRole.title == ex_role_title,
            ).first()
            if not ex_role:
                ex_role = ClubRole(
                    club_id=existing_club.id,
                    title=ex_role_title,
                    description=f"Ex-{previous_role.description}",
                    privilege=previous_role.privilege - 1
                )
                db.add(ex_role)
                db.commit()
                db.refresh(ex_role)
            return ex_role
        if not current_role.title.startswith("ex-"):
            current_role = ensure_ex_role(current_role)
            current_membership.role_id = current_role.id
            db.commit()
        new_existing_role = db.query(ClubRole).filter(ClubRole.title == role, ClubRole.club_id == existing_club.id).first()
        if new_existing_role.privilege > 90:
            return {'content':{'type': "error", 'details': "Clubs do not have privilege for this operation contact council instead"}}
        
        if not new_existing_role:
            return {'content':{'type': "error", 'details': "Role not found"}}
        new_membership = ClubMembership(
            student_id = existing_student.id,
            club_id = existing_club.id,
            role_id = new_existing_role.id
        )
        db.add(new_membership)
        db.commit()
        return {'content':{'type': "ok", 'details': "Club membership updated"}}
    except Exception as e:
        print("Error in membership update in:", e)
        db.rollback()
        return {'content':{"type": "error", "detail": "An error occurred with login", 'status_code': 500}}

@router.post("/membership/list")
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


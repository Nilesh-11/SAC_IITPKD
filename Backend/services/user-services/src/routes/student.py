
from src.utils.auth import hash_password
from src.models.users import Student, Club, ClubMembership, ClubRole
from src.schemas.request import JoinClubRequest
from src.database.connection import get_users_db
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/club/join")
def join_club(data: JoinClubRequest, db: Session = Depends(get_users_db)):
    club_id=data.club_id
    request_by=data.request_by
    try:
        existing_student = db.query(Student).filter(Student.email == request_by).first()
        if not existing_student:
            return {'content':{'type': "error", 'details': "Student not found"}}
        existing_club = db.query(Club).filter(Club.id == club_id).first()
        if not existing_club:
            return {'content':{'type': "error", 'details': "Club not found"}}
        existing_membership = db.query(ClubMembership)\
                                .filter(ClubMembership.student_id == existing_student.id, ClubMembership.club_id == existing_club.id)
        if existing_membership:
            return {'content':{'type': "error", 'details': f"Already a member as {existing_membership.role}"}}
        new_club_membership = ClubMembership(
            student_id=existing_student.id,
            club_id=club_id,
        )
        default_role = db.query(ClubRole).filter(ClubRole.club_id == club_id, ClubRole.title == "member").first()
        if default_role:
            new_club_membership.role_id = default_role.id
        db.add(new_club_membership)
        db.commit()
        db.refresh(new_club_membership)
        return {'content':{'type': "ok", 'details': "Club membership added", 'id':new_club_membership.id}}
    except Exception as e:
        print("Error in log in:", e)
        return {'content':{"type": "error", "detail": "An error occurred with login", 'status_code': 500}}

# @router.post("/save-password")
# def forgot_password(data: SavePasswordRequest, db_user: Session = Depends(get_users_db)):
#     email = data.email
#     token = data.token
#     password = data.password
#     hashed_password = hash_password(password)

#     try:
#         existing_user = db_user.query(Student).filter(Student.email == email).first()
#         if not existing_user:
#             return {'content':{'type': "error", 'details': "Student not found, sign up first"}}
#         data = verify_jwt(token)
#         if not data:
#             return {'content':{'type': "error", 'details': "Unauthorized user"}}
#         existing_user.password_hash = hashed_password
#         db_user.commit()
#         return {'content':{'type': "ok", 'details': "password saved successfully"}}
#     except Exception as e:
#         print("Error in log in:", e)
#         return {'content':{"type": "error", "detail": "An error occurred with login", 'status_code': 500}}
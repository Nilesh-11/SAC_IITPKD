
from src.utils.auth import hash_password
from src.models.users import Student, Club, ClubMembership, ClubRole
from src.schemas.request import CoreteamRequest, ClubInfoRequest, JoinClubRequest
from src.schemas.objects import CoreTeamMember
from src.models.projects import Project
from src.database.connection import get_users_db, get_projects_db
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/club/coreteam")
def core_team(data: CoreteamRequest, db: Session = Depends(get_users_db)):
    try:
        existing_student = db.query(Student).filter(Student.email == data.request_by).first()
        if not existing_student:
            return {'content':{'type': "error", 'details': "Student not found"}}
        requesting_club = db.query(Club).filter(Club.email == data.club_email).first()
        if not requesting_club:
            return {'content': {'type': 'error', 'details': 'Club not found'}}
        memberships = db.query(ClubMembership).join(ClubRole).filter(
            ClubMembership.club_id == requesting_club.id,
            (
                (~ClubRole.title.startswith('ex-')) | 
                (ClubRole.privilege > 50)
            )
        ).all()
        core_team_members = []
        for membership in memberships:
            core_team_members.append(CoreTeamMember(
                user_id=membership.student.id,
                name=membership.student.name,
                email=membership.student.email,
                role_title=membership.role.title if membership.role else None,
                role_privilege=membership.role.privilege if membership.role else 0,
                club_name=requesting_club.name
            ))
        return {
            'content': {
                'type': 'ok',
                'details': 'Core team retrieved',
                'core_team': [member.dict() for member in core_team_members]
            }
        }
    except Exception as e:
        print("ERROR in getting core team:", e)
        return {'content': {'type': 'error', 'details': 'An error occurred'}}

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
                                .filter(ClubMembership.student_id == existing_student.id, 
                                        ClubMembership.club_id == existing_club.id,
                                        ~ClubRole.title.startswith('ex-'))\
                                .first()
        if existing_membership:
            return {'content':{'type': "error", 'details': f"Already a member as {existing_membership.role.title}"}}
        default_role = db.query(ClubRole)\
                        .filter(ClubRole.club_id == club_id, ClubRole.title == "member")\
                        .first()
        new_club_membership = ClubMembership(
            student_id=existing_student.id,
            club_id=club_id,
            role_id=default_role.id
        )
        db.add(new_club_membership)
        db.commit()
        db.refresh(new_club_membership)
        return {'content':{'type': "ok", 'details': "Club membership added", 'id':new_club_membership.id}}
    except Exception as e:
        db.rollback()
        print("Error in club join:", e)
        return {'content':{"type": "error", "detail": "An error occurred with join club", 'status_code': 500}}

@router.post("/club/info")
def club_information(data: ClubInfoRequest, db: Session = Depends(get_users_db), db_projects: Session = Depends(get_projects_db)):
    club_id = data.club_id
    request_by=data.request_by
    try:
        existing_club = db.query(Club).filter(Club.id == club_id).first()
        if not existing_club:
            return {'content':{"type": "error", "detail": "club not found"}}
        members = db.query(ClubMembership, Student)\
            .join(ClubRole)\
            .join(Student)\
            .filter(
                ClubMembership.club_id == existing_club.id,
                ~ClubRole.title.startswith('ex-')
            ).order_by(ClubMembership.joined_date.desc())\
            .limit(30)\
            .all()
        user_membership = db.query(ClubMembership, ClubRole)\
            .join(ClubRole)\
            .join(Student)\
            .filter(
                ClubMembership.club_id == existing_club.id,
                Student.email == data.request_by,
                ~ClubRole.title.startswith('ex-')
            ).first()
        is_member = user_membership is not None
        user_role = user_membership[1].title if user_membership else ""
        formatted_members = [
            {
                "name": student.name,
                "email": student.email,
                "joined_date": membership.joined_date.isoformat()
            }
            for membership, student in members
        ]
        head_name = existing_club.head.name if existing_club.head else ""
        cohead_names = [cohead.name for cohead in existing_club.coheads]
        projects = db_projects.query(Project)\
            .filter(
                Project.coordinator_role == "club",
                Project.coordinator == existing_club.email
            ).all()
        formatted_projects = [
            {
                "id": p.id,
                "title": p.title,
                "description": p.description,
                "proj_type": p.proj_type,
                "status": p.status,
                "start_date": p.start_date.isoformat(),
                "end_date": p.end_date.isoformat(),
                "skills": p.skills,
                "max_members_count": p.max_members_count,
                "current_members_count": p.current_members_count
            }
            for p in projects
        ]
        response_data = {
            "id": existing_club.id,
            "name": existing_club.name,
            "is_member": is_member,
            "role": user_role,
            "title": existing_club.title,
            "description": existing_club.description,
            "head": head_name,
            "coheads": cohead_names,
            "email": existing_club.email,
            "members": formatted_members,
            "projects": formatted_projects
        }
        return {'content': {'type': "ok", 'details': "Club info fetched successfully", 'club': response_data}}
    except Exception as e:
        print("Error in club info:", e)
        db.rollback()
        return {'content':{"type": "error", "detail": "An error occurred with club info", 'status_code': 500}}


from src.utils.auth import hash_password
from src.schemas.request import ClubListRequest, DeleteClubRequest, UpdateClubRequest, DeleteAnnouncementRequest, AddAnnouncementRequest, UpdateAnnouncementRequest, AddClubRequest
from src.utils.verify import verify_user
from src.models.projects import Project
from src.models.users import Council, Student, Club, Admin, ClubRole, ClubMembership
from src.models.public import Announcements
from src.database.connection import get_users_db, get_public_db
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import datetime

router = APIRouter()

@router.post("/club/add")
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
            return JSONResponse(content={"type": "error", "details": "Council not found"},
                                status_code=404)
        head_student  = db.query(Student).filter(Student.email == head).first()
        if not head_student :
            return JSONResponse(content={"type": "error", "details": "Head student not found"},
                                status_code=404)
        
        cohead_objs = []
        for cohead_email in coheads:
            existing_cohead = db.query(Student).filter(Student.email == cohead_email).first()
            if not existing_cohead:
                return JSONResponse(content={"type": "error", "details": f"Co-head {cohead_email} not found"},
                                    status_code=404)
            cohead_objs.append(existing_cohead)

        new_club = Club(
            name=name,
            title=title,
            description=description,
            email=email,
            password_hash=password_hash,
            faculty_advisor=faculty_advisor,
            head=head_student,
            coheads=cohead_objs,
            council_id=existing_council.id
        )
        db.add(new_club)
        db.commit()
        db.refresh(new_club)
        member_role = ClubRole(
            club_id=new_club.id,
            title="member",
            description="Member of club",
            privilege=2
        )
        head_role = ClubRole(
            club_id=new_club.id,
            title="head",
            description="Head of club",
            privilege=100
        )
        cohead_role = ClubRole(
            club_id=new_club.id,
            title="co-head",
            description="Co-head of club",
            privilege=99
        )

        db.add_all([member_role, head_role, cohead_role])
        db.commit()
        db.refresh(head_role)
        db.refresh(cohead_role)
        head_membership = ClubMembership(
            student_id=head_student.id,
            club_id=new_club.id,
            role_id=head_role.id
        )
        db.add(head_membership)
        db.commit()
        for cohead in cohead_objs:
            cohead_membership = ClubMembership(
                student_id=cohead.id,
                club_id=new_club.id,
                role_id=cohead_role.id
            )
            db.add(cohead_membership)
            db.commit()
        return JSONResponse(content={
                                "type": "ok",
                                "details": "Club created successfully",
                                "club": {
                                    "id": new_club.id,
                                    "name": new_club.name,
                                    "email": new_club.email
                                }
                            },
                            status_code=201)

    except Exception as e:
        db.rollback()
        print("Error adding club:", e)
        return JSONResponse(content={"type": "error", "details": "Failed to create club"},
                            status_code=500)

@router.post("/club/update")
def update_club(request: UpdateClubRequest, db: Session = Depends(get_users_db)):
    name = request.name
    title = request.title
    email = request.email
    description = request.description
    password = request.password
    password_hash = hash_password(password)
    faculty_advisor = request.faculty_advisor
    head = request.head
    coheads = request.coheads
    request_by = request.request_by

    try:
        existing_council = db.query(Council).filter(Council.email == request_by).first()
        if not existing_council:
            return JSONResponse(content={"type": "error", "details": "Council not found"},
                                status_code=404)
        if len(coheads) != len(set(coheads)):
            return JSONResponse(content={"type": "error", "details": "Duplicate co-heads found"},
                                status_code=400)
        if head in coheads:
            return JSONResponse(content={"type": "error", "details": "Head cannot also be a co-head"},
                                status_code=400)
        existing_head = db.query(Student).filter(Student.email == head).first()
        if not existing_head:
            return JSONResponse(content={"type": "error", "details": "Head student not found"},
                                status_code=404)
        for cohead_email in coheads:
            existing_cohead = db.query(Student).filter(Student.email == cohead_email).first()
            if not existing_cohead:
                return JSONResponse(content={"type": "error", "details": f"Co-head {cohead_email} not found"},
                                    status_code=404)
        existing_club = db.query(Club).filter(Club.email == email, Club.council_id == existing_council.id).first()
        if not existing_club:
            return JSONResponse(content={"type": "error", "details": "Club not found"},
                                status_code=404)

        current_head = existing_club.head
        current_coheads = existing_club.coheads

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
        
        for current_cohead in current_coheads:
            if current_cohead.email not in coheads:
                current_cohead_membership = db.query(ClubMembership)\
                                            .join(ClubRole)\
                                            .filter(ClubMembership.club_id == existing_club.id,
                                                    ClubMembership.student_id == current_cohead.id,
                                                    ~ClubRole.title.startswith('ex-'))\
                                            .first()
                if current_cohead_membership:
                    ex_cohead_role = ensure_ex_role(current_cohead_membership.role)
                    current_cohead_membership.role_id = ex_cohead_role.id

        if current_head and current_head.email != existing_head.email:
            current_head_membership = db.query(ClubMembership)\
                                        .join(ClubRole)\
                                        .filter(ClubMembership.club_id == existing_club.id,
                                                ClubMembership.student_id == current_head.id,
                                                ~ClubRole.title.startswith('ex-'))\
                                        .first()
            if current_head_membership:
                print("this should not execute ever")
                ex_head_role = ensure_ex_role(current_head_membership.role)
                current_head_membership.role_id = ex_head_role.id
            existing_new_head_membership = db.query(ClubMembership)\
                                            .join(ClubRole)\
                                            .filter(ClubMembership.club_id == existing_club.id,
                                                    ClubMembership.student_id == existing_head.id,
                                                    ~ClubRole.title.startswith('ex-'))\
                                            .first()
            if existing_new_head_membership:
                ex_role = ensure_ex_role(existing_new_head_membership.role)
                existing_new_head_membership.role_id = ex_role.id
            
            new_head_role = db.query(ClubRole).filter(
                ClubRole.club_id == existing_club.id,
                ClubRole.title == "head"
            ).first()
            new_head_membership = ClubMembership(
                student_id=existing_head.id,
                club_id=existing_club.id,
                role_id=new_head_role.id
            )
            db.add(new_head_membership)
            db.commit()

        cohead_role = db.query(ClubRole).filter(
            ClubRole.club_id == existing_club.id,
            ClubRole.title == "co-head"
        ).first()
        
        for cohead_email in coheads:
            cohead_student = db.query(Student).filter(Student.email == cohead_email).first()
            existing_cohead_membership = db.query(ClubMembership).filter(
                ClubMembership.club_id == existing_club.id,
                ClubMembership.student_id == cohead_student.id,
                ClubMembership.role_id == cohead_role.id
            ).first()
            if not existing_cohead_membership:
                existing_cohead_club_membership = existing_cohead_membership = db.query(ClubMembership)\
                                                                                .join(ClubRole)\
                                                                                .filter(ClubMembership.club_id == existing_club.id,
                                                                                    ClubMembership.student_id == cohead_student.id,
                                                                                    ~ClubRole.title.startswith('ex-'))\
                                                                                .first()
                if existing_cohead_club_membership:
                    ex_role = ensure_ex_role(existing_cohead_club_membership.role)
                    existing_cohead_club_membership.role_id = ex_role.id
                    db.commit()
                new_cohead_membership = ClubMembership(
                    student_id=cohead_student.id,
                    club_id=existing_club.id,
                    role_id=cohead_role.id
                )
                db.add(new_cohead_membership)
                db.commit()
        
        existing_club.name = name
        existing_club.title = title
        existing_club.description = description
        existing_club.faculty_advisor = faculty_advisor
        existing_club.head = existing_head
        existing_club.coheads = [db.query(Student).filter(Student.email == cohead).first() for cohead in coheads]
        if password:
            existing_club.password_hash = password_hash
        db.commit()
        db.refresh(existing_club)
        return JSONResponse(
            content={
                "type": "ok",
                "details": "Club updated successfully",
                "club": {
                    "id": existing_club.id,
                    "name": existing_club.name,
                    "email": existing_club.email
                }
            }
        )

    except Exception as e:
        db.rollback()
        print("Error updating club:", e)
        return JSONResponse(
            content={"type": "error", "details": "Failed to update club"},
            status_code=500
        )

@router.post("/club/delete")
def delete_club(data: DeleteClubRequest, db: Session = Depends(get_users_db)):
    club_id = data.club_id
    request_by = data.request_by
    try:
        existing_council = db.query(Council).filter(Council.email == request_by).first()
        if not existing_council:
            return JSONResponse(
                content={"type": "error", "details": "Council not found"},
                status_code=404
            )
        existing_club = db.query(Club).filter(Club.id == club_id, Club.council_id == existing_council.id).first()
        if not existing_club:
            return JSONResponse(
                content={"type": "error", "details": "Club not found"},
                status_code=404
            )
        db.delete(existing_club)
        db.commit()
        return JSONResponse(
            content={
                "type": "ok",
                "details": "Club deleted successfully"
            }
        )
    except Exception as e:
        db.rollback()
        print("Error deleting club:", e)
        return JSONResponse(
            content={"type": "error", "details": "Failed to delete club"},
            status_code=500
        )

@router.post("/club/list")
def clubs_list(request: ClubListRequest, db: Session = Depends(get_users_db)):
    try:
        existing_council = db.query(Council).filter(Council.email == request.request_by).first()
        if not existing_council:
            return JSONResponse(
                content={"type": "error", "details": "Council not found"},
                status_code=404
            )

        clubs = db.query(Club).filter(Club.council_id == existing_council.id).all()

        formatted_clubs = []
        for club in clubs:
            head_info = None
            if club.head:
                head_info = {
                    'id': club.head.id,
                    'name': club.head.name,
                    'email': club.head.email
                }
            coheads_info = []
            for cohead in club.coheads:
                coheads_info.append({
                    'id': cohead.id,
                    'name': cohead.name,
                    'email': cohead.email
                })

            club_data = {
                'id': club.id,
                'name': club.name,
                'title': club.title,
                'email': club.email,
                'description': club.description,
                'faculty_advisor': club.faculty_advisor,
                'head': head_info,
                'coheads': coheads_info,
                'council_id': club.council_id
            }
            formatted_clubs.append(club_data)

        return JSONResponse(
            content={
                "type": "ok",
                "details": f"Found {len(formatted_clubs)} clubs",
                "clubs": formatted_clubs,
                "count": len(formatted_clubs)
            }
        )

    except Exception as e:
        print("Error listing clubs:", e)
        return JSONResponse(
            content={"type": "error", "details": "Failed to retrieve clubs"},
            status_code=500
        )
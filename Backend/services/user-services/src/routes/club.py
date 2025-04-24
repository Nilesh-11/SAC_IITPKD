from src.schemas.request import DeleteRoleRequest, MemberInfoRequest, RolesListRequest, UpdateRolesRequest, AddRolesRequest, MembersListRequest, UpdateMembershipRequest, DeleteAnnouncementRequest, AddAnnouncementRequest, UpdateAnnouncementRequest
from src.models.users import Student, Club, ClubMembership, ClubRole
from src.database.connection import get_users_db
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from sqlalchemy import func

router = APIRouter()

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
        return {'content': {'type':"ok", 'details': "Role added",'id': new_club_role.id}}
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
        if existing_role.privilege > 90 or existing_role.privilege <= 5:
            return {'content':{'type': "error", 'details': "Club is unauthorized, contact council!"}}
        existing_role.title = title
        existing_role.description = description
        existing_role.privilege=privilege
        db.commit()
        return {'content': {'type':"ok", 'details': "Role updated"}}
    except Exception as e:
        print("ERROR in updating roles:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/role/delete")
def delete_roles(data: DeleteRoleRequest, db: Session = Depends(get_users_db)):
    id = data.role_id
    request_by = data.request_by
    try:
        existing_club = db.query(Club).filter(Club.email == request_by).first()
        if not existing_club:
            return {'content': {'type': "error", 'details': "Club not found"}}
        existing_role = db.query(ClubRole).filter(ClubRole.id == id).first()
        if not existing_club:
            return {'content': {'type': "error", 'details': "Club Role not found"}}
        if existing_role.privilege > 90 or existing_role.privilege <= 5:
            return {'content':{'type': "error", 'details': "Club is unauthorized, contact council!"}}
        db.delete(existing_role)
        db.commit()
        return {'content': {'type':"ok", 'details': "Role deleted"}}
    except Exception as e:
        print("ERROR in deleting roles:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/role/list")
def roles_list(data: RolesListRequest, db: Session = Depends(get_users_db)):
    request_by = data.request_by
    try:
        existing_club = db.query(Club).filter(Club.email == request_by).first()
        if not existing_club:
            return {'content': {'type': "error", 'details': "Club not found"}}

        roles = db.query(ClubRole).filter(
            ClubRole.club_id == existing_club.id
        ).order_by(ClubRole.privilege.desc()).all()

        roles_list = [{
            'id': role.id,
            'title': role.title,
            'privilege': role.privilege,
            'description': role.description,
            'created_at': role.created_at.isoformat() if role.created_at else None,
            'updated_at': role.updated_at.isoformat() if role.updated_at else None,
            'member_count': len(role.memberships)
        } for role in roles]

        return {
            'content': {
                'type': "ok",
                'details': f"Found {len(roles_list)} roles",
                'roles': roles_list
            }
        }

    except Exception as e:
        print(f"ERROR retrieving roles list: {e}")
        return {'content': {'type': "error", 'details': "An error occurred"}}

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
        if current_role.privilege > 90 or current_membership.role.privilege > 90:
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

@router.post("/member/info")
def member_info(data: MemberInfoRequest, db: Session = Depends(get_users_db)):
    try:
        club = db.query(Club).filter(Club.email == data.request_by).first()
        if not club:
            return {'content': {'type': 'error', 'details': 'Club not found'}}

        student = db.query(Student).filter(Student.email == data.student_mail).first()
        if not student:
            return {'content': {'type': 'error', 'details': 'Student not found'}}

        membership = db.query(ClubMembership)\
            .options(
                joinedload(ClubMembership.role)
            )\
            .filter(
                ClubMembership.club_id == club.id,
                ClubMembership.student_id == student.id
            )\
            .first()

        if not membership:
            return {'content': {'type': 'error', 'details': 'Student is not a member of this club'}}

        role_info = None
        if membership.role:
            is_active = not membership.role.title.startswith("ex-")
            original_title = membership.role.title[3:] if not is_active else membership.role.title
            
            role_info = {
                'id': membership.role.id,
                'title': original_title,
                'privilege': membership.role.privilege,
                'is_active': is_active,
                'description': membership.role.description
            }

        response_data = {
            'student': {
                'id': student.id,
                'name': student.name,
                'email': student.email,
                'batch': student.batch,
                'department': student.department
            },
            'membership': {
                'joined_date': membership.joined_date.isoformat(),
                'last_updated': membership.updated_date.isoformat() if membership.updated_date else None
            },
            'role': role_info
        }

        return {'content': {'type': 'ok', 'details': 'Member information retrieved', 'data': response_data}}

    except Exception as e:
        print(f"ERROR retrieving member info: {e}")
        return {'content': {'type': 'error', 'details': 'Failed to retrieve member information'}}


@router.post("/members/list")
def join_club(data: MembersListRequest, db: Session = Depends(get_users_db)):
    try:
        existing_club = db.query(Club).filter(Club.email == data.request_by).first()
        if not existing_club:
            return {'content': {'type': "error", 'details': "Club not found"}}

        memberships = db.query(ClubMembership)\
            .join(ClubRole, ClubMembership.role_id == ClubRole.id, isouter=True)\
            .options(
                joinedload(ClubMembership.student)
            )\
            .filter(ClubMembership.club_id == existing_club.id)\
            .order_by(
                ClubRole.privilege.desc(),
                ClubMembership.joined_date.asc()
            )\
            .all()

        formatted_members = []
        for membership in memberships:
            # Format role information
            role_info = None
            is_active = True
            if membership.role:
                original_title = membership.role.title
                if membership.role.title.startswith("ex-"):
                    is_active = False
                    original_title = membership.role.title[3:]
                
                role_info = {
                    'id': membership.role.id,
                    'title': original_title,
                    'privilege': membership.role.privilege,
                    'is_active': is_active,
                    'description': membership.role.description
                }

            # Format student information
            student_info = {
                'id': membership.student.id,
                'name': membership.student.name,
                'email': membership.student.email,
                'batch': membership.student.batch,
                'department': membership.student.department
            } if membership.student else None

            formatted_members.append({
                'membership_id': membership.id,
                'student': student_info,
                'role': role_info,
                'joined_date': membership.joined_date.isoformat() if membership.joined_date else None,
                'last_updated': membership.updated_date.isoformat() if membership.updated_date else None
            })

        return {
            'content': {
                'type': "ok",
                'details': f"Found {len(formatted_members)} members",
                'members': formatted_members
            }
        }

    except Exception as e:
        print(f"ERROR retrieving members list: {e}")
        return {'content': {'type': "error", 'details': "An error occurred"}}

@router.post("/members/lists")
def members_lists(data: MembersListRequest, db: Session = Depends(get_users_db)):
    try:
        existing_club = db.query(Club).filter(Club.email == data.request_by).first()
        if not existing_club:
            return {'content': {'type': "error", 'details': "Club not found"}}

        total_members = db.query(func.count(ClubMembership.id))\
                        .filter(ClubMembership.club_id == existing_club.id)\
                        .scalar()

        limit = min(data.limit, 100) if hasattr(data, 'limit') else 100

        # Fixed query with proper joins and ordering
        memberships = db.query(ClubMembership)\
            .join(ClubRole, ClubMembership.role_id == ClubRole.id)\
            .options(
                joinedload(ClubMembership.student)
            )\
            .filter(ClubMembership.club_id == existing_club.id)\
            .order_by(
                ClubRole.privilege.desc(),  # Direct reference to ClubRole column
                ClubMembership.joined_date.asc()
            )\
            .limit(limit)\
            .all()

        formatted_members = []
        for membership in memberships:
            role_info = None
            is_active = True
            original_title = membership.role.title if membership.role else None
            
            if membership.role and membership.role.title.startswith("ex-"):
                is_active = False
                original_title = membership.role.title[3:]
                
            if membership.role:
                role_info = {
                    'id': membership.role.id,
                    'title': original_title,
                    'privilege': membership.role.privilege,
                    'is_active': is_active,
                    'description': membership.role.description
                }

            student_info = {
                'id': membership.student.id,
                'name': membership.student.name,
                'email': membership.student.email,
                'batch': membership.student.batch,
                'department': membership.student.department
            } if membership.student else None

            formatted_members.append({
                'membership_id': membership.id,
                'student': student_info,
                'role': role_info,
                'joined_date': membership.joined_date.isoformat(),
                'last_updated': membership.updated_date.isoformat() if membership.updated_date else None
            })

        return {
            'content': {
                'type': "ok",
                'details': f"Showing {len(formatted_members)} of {total_members} members",
                'total_members': total_members,
                'limit': limit,
                'members': formatted_members
            }
        }
    except Exception as e:
        print(f"ERROR retrieving members list: {e}")
        return {'content': {'type': "error", 'details': "An error occurred"}}

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


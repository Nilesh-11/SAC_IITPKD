from src.schemas.request import MyProjectsRequest, ProjectInfoRequest, OwnProjectsRequest, MeetingReminderRequest, UpdateMeetingRequest, DeleteMeetingRequest, MeetingType, AddMeetingRequest, RemoveApplicationRequest, WithdrawApplicationRequest, UpdateApplicationRequest, GetProjectsRequest, GetProjectRequest, UpdateProjectRequest, DeleteProjectRequest, AddProjectRequest, ShortlistRequest, ApplyProjectRequest
from src.models.projects import Project, ApprovedParticipant, UnverifiedParticipant, Meetings
from src.models.users import Student, Club, UserRole
from src.database.connection import get_projects_db, get_users_db
from src.utils.mail import send_meeting_reminder_mail, send_new_meeting_mail
from fastapi.responses import RedirectResponse
from src.utils.verify import verify_user
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, subqueryload
from sqlalchemy import exists
import datetime

router = APIRouter()

@router.post("/add")
def add_project(data: AddProjectRequest, db: Session = Depends(get_projects_db), db_user: Session = Depends(get_users_db)):
    print(data)
    proj_type = data.proj_type
    member_roles = data.member_roles
    proj_domain = data.proj_domain
    title = data.title
    description = data.description
    start_date = data.start_date
    end_date = data.end_date
    skills = data.skills
    max_members_count = data.max_members_count
    request_by = data.request_by

    try:
        coordinator_role = verify_user(request_by, db_user)
        if not coordinator_role:
            return {'content': {'type': "error", 'details': "Unauthorized"}}
        if coordinator_role not in [UserRole.student.value, UserRole.club.value]:
            return {'content': {'type': "error", 'details': "User cannot add new projects"}}
        if data.start_date > data.end_date:
            return {'content': {'type': "error", 'details': "Start date must be before or equal to end date"}}
        new_project = Project(
            coordinator=request_by,
            coordinator_role=coordinator_role,
            proj_type=proj_type,
            member_roles=member_roles,
            proj_domain=proj_domain,
            title=title,
            description=description,
            start_date=start_date,
            end_date=end_date,
            skills=skills,
            max_members_count=max_members_count
        )
        db.add(new_project)
        db.commit()
        db.refresh(new_project)
        coordinator = db_user.query(Student).filter(Student.email == request_by).first()
        if coordinator:
            participant = ApprovedParticipant(
                project_id=new_project.id,
                email=coordinator.email,
                role="coordinator",
                skills=[],
                phone_number=coordinator.phone_number
            )
            db.add(participant)
            db.commit()
        else:
            coordinator = db_user.query(Club).filter(Club.email == request_by).first()
            participant = ApprovedParticipant(
                project_id=new_project.id,
                email=coordinator.email,
                skills=[],
                role="coordinator"
            )
            db.add(participant)
            db.commit()
        return {'content':{'type': "ok", 'id': new_project.id, 'details': "New project added"}}
    except Exception as e:
        print("ERROR in add event:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/info")
def project_info(data: ProjectInfoRequest, db: Session = Depends(get_projects_db), db_user: Session = Depends(get_users_db)):
    try:
        project = db.query(Project).options(
            subqueryload(Project.approved_participants),
            subqueryload(Project.unverified_participants),
            subqueryload(Project.meetings)
        ).filter(Project.id == data.project_id).first()

        if not project:
            return {'content': {'type': 'error', 'details': 'Project not found'}}

        coordinator_info = db_user.query(Student).filter(Student.email == project.coordinator).first()
        if not coordinator_info:
            coordinator_info = db_user.query(Club).filter(Club.email == project.coordinator).first()
        if not coordinator_info:
            return {'content': {'type': "error", 'details': "Coordinator not found"}}

        user_role = None
        is_member = False
        is_coordinator = project.coordinator == data.request_by
        already_applied = False
        
        if is_coordinator:
            user_role = project.coordinator_role
            is_member = True
            already_applied = False
        else:
            for participant in project.approved_participants:
                if participant.email == data.request_by:
                    user_role = participant.role
                    is_member = True
                    already_applied = False
                    break
            for participant in project.unverified_participants:
                if participant.email == data.request_by:
                    user_role = "applicant"
                    already_applied = False

        approved_members = [{
            "name": db_user.query(Student.name).filter(Student.email == member.email).scalar(),
            "email": member.email,
            "role": member.role
        } for member in project.approved_participants]
        
        response_data = {
            "id": project.id,
            "title": project.title,
            "coordinator":{
                "email": coordinator_info.email,
                "name": coordinator_info.full_name if project.coordinator_role == "student" else coordinator_info.title,
                "role": project.coordinator_role
            },
            "description": project.description,
            "type": project.proj_type,
            "domain": project.proj_domain,
            "status": project.status,
            "timeline": {
                "start": project.start_date.isoformat(),
                "end": project.end_date.isoformat()
            },
            "approved_members": approved_members,
            "requirements": {
                "skills": project.skills,
                "roles": project.member_roles
            },
            "capacity": {
                "current": project.current_members_count,
                "max": project.max_members_count
            },
            "pending_requests": len(project.unverified_participants),
            "your_status": {
                "is_member": is_member,
                "role": user_role,
                "is_coordinator": is_coordinator,
                "already_applied": already_applied
            },
            "meetings": [{
                "title": m.title,
                "type": m.meeting_type.value,
                "time": m.scheduled_at.isoformat()
            } for m in project.meetings]
        }

        return {'content': {
            'type': 'ok',
            'details': 'Project details retrieved',
            'data': response_data
        }}

    except Exception as e:
        print(f"ERROR retrieving project info: {e}")
        return {'content': {'type': 'error', 'details': 'Failed to retrieve project information'}}

@router.post("/shortlist")
def decide_participant(data: ShortlistRequest, db: Session = Depends(get_projects_db)):
    id = data.participant_id
    proj_id = data.project_id
    is_approved = data.is_approved
    role = data.role
    request_by = data.request_by

    try:
        existing_project = db.query(Project).filter(Project.id == proj_id).first()
        if not existing_project:
            return {'content': {'type': "error", 'details': "project not found"}}
        if existing_project.coordinator != request_by:
            return {'content': {'type': "error", 'details': "Unauthorized User"}}
        if existing_project.current_members_count == existing_project.max_members_count:
            return {'content': {'type': "error", 'details': "Members limit reached"}}
        existing_member = db.query(UnverifiedParticipant).filter(UnverifiedParticipant.id == id, UnverifiedParticipant.project_id == proj_id).first()
        if not existing_member:
            return {'content': {'type': "error", 'details': "member has not applied for the project"}}
        if is_approved:
            if not role:
                return {'content': {'type': "error", 'details': "no role specified"}}
            already_approved = db.query(ApprovedParticipant).filter(ApprovedParticipant.email == existing_member.email, ApprovedParticipant.project_id == existing_member.project_id).first()
            if already_approved:
                return {'content': {'type': "error", 'details': "User already approved"}}
            member = ApprovedParticipant(
                project_id = existing_member.project_id,
                email = existing_member.email,
                role = role,
                skills = existing_member.skills,
                phone_number = existing_member.phone_number
            )
            db.add(member)
            db.commit()
            existing_project.current_members_count += 1
        db.delete(existing_member)
        db.commit()
        return {'content':{'type': "ok"}}
    except Exception as e:
        print("ERROR in projects list:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/update")
def update_event(data: UpdateProjectRequest, db: Session = Depends(get_projects_db)):
    try:
        existing_project = db.query(Project).filter(Project.id == data.id).first()
        if not existing_project:
            return {'content': {'type': 'error', 'details': 'Project not found'}}
        if existing_project.coordinator != data.request_by:
            return {'content': {'type': 'error', 'details': 'Unauthorized coordinator'}}
        if data.start_date > data.end_date:
            return {'content': {'type': "error", 'details': "Start date must be before or equal to end date"}}

        old_roles = set(existing_project.member_roles or [])
        new_roles = set(data.member_roles or [])
        roles_changed = old_roles != new_roles

        coordinator_email = existing_project.coordinator

        if roles_changed:
            db.query(ApprovedParticipant).filter(
                ApprovedParticipant.project_id == existing_project.id,
                ~ApprovedParticipant.role.in_(data.member_roles or []),
                ApprovedParticipant.email != coordinator_email
            ).delete(synchronize_session=False)

            if data.member_roles:
                db.query(UnverifiedParticipant).filter(
                    UnverifiedParticipant.project_id == existing_project.id,
                    ~UnverifiedParticipant.roles_applied.overlap(data.member_roles)
                ).delete(synchronize_session=False)
            else:
                db.query(UnverifiedParticipant).filter(
                    UnverifiedParticipant.project_id == existing_project.id
                ).delete(synchronize_session=False)

        coordinator_entry = db.query(ApprovedParticipant).filter(
            ApprovedParticipant.project_id == existing_project.id,
            ApprovedParticipant.email == coordinator_email
        ).first()

        if not coordinator_entry:
            new_coordinator_entry = ApprovedParticipant(
                project_id=existing_project.id,
                email=coordinator_email,
                role="Coordinator",
                skills=[]
            )
            db.add(new_coordinator_entry)
        
        existing_project.proj_type = data.proj_type
        existing_project.member_roles = data.member_roles
        existing_project.proj_domain = data.proj_domain
        existing_project.title = data.title
        existing_project.description = data.description
        existing_project.start_date = data.start_date
        existing_project.end_date = data.end_date
        existing_project.skills = data.skills
        existing_project.max_members_count = data.max_members_count

        current_members = db.query(ApprovedParticipant).filter(
            ApprovedParticipant.project_id == existing_project.id
        ).count()
        existing_project.current_members_count = current_members

        if existing_project.current_members_count > existing_project.max_members_count:
            db.rollback()
            return {
                'content': {
                    'type': 'error',
                    'details': f'Current members ({current_members}) exceed new max limit ({data.max_members_count})'
                }
            }
        db.commit()
        return {'content': {'type': "ok", 'project': existing_project}}
    except Exception as e:
        db.rollback()
        print(f"ERROR updating project: {e}")
        return {'content': {'type': "error", 'details': "Failed to update project"}}

@router.post("/delete")
def delete_event(data: DeleteProjectRequest, db: Session = Depends(get_projects_db)):
    request_by=data.request_by
    id = data.id
    try:
        existing_project = db.query(Project).filter(Project.id == id).first()
        if not existing_project:
            return {'content':{'type': 'error', 'details': 'Project not found'}}
        if existing_project.coordinator != request_by:
            return {'content':{'type': 'error', 'details': 'Unauthorized user'}}
        db.delete(existing_project)
        db.commit()
        return {'content':{'type': "ok", 'details': "Projects successfully removed"}}
    except Exception as e:
        print("ERROR in an updating project:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/own")
def my_projects(data: OwnProjectsRequest, db: Session = Depends(get_projects_db)):
    request_by = data.request_by
    try:
        projects = db.query(Project).options(
            subqueryload(Project.approved_participants),
            subqueryload(Project.unverified_participants),
            subqueryload(Project.meetings)
        ).filter(
            Project.coordinator == request_by
        ).order_by(Project.start_date.desc()).all()

        formatted_projects = []
        for project in projects:

            formatted_projects.append({
                "id": project.id,
                "title": project.title,
                "description": project.description,
                "project_type": project.proj_type,
                "domain": project.proj_domain,
                "status": project.status,
                "start_date": project.start_date.isoformat(),
                "end_date": project.end_date.isoformat(),
                "skills_required": project.skills,
                "member_roles": project.member_roles,
                "max_members_count": project.max_members_count
            })

        return {
            'content': {
                'type': 'ok',
                'details': f"Found {len(formatted_projects)} owned projects",
                'projects': formatted_projects
            }
        }

    except Exception as e:
        print(f"ERROR retrieving owned projects: {e}")
        return {
            'content': {
                'type': 'error',
                'details': 'Failed to retrieve project details'
            }
        }

@router.post("/my")
def my_projects(data: MyProjectsRequest, db: Session = Depends(get_projects_db), db_user: Session = Depends(get_users_db)):
    try:
        request_by = data.request_by
        
        projects = db.query(Project).options(
            subqueryload(Project.approved_participants),
            subqueryload(Project.unverified_participants),
            subqueryload(Project.meetings)
        ).filter(
            (Project.coordinator == request_by) |
            exists().where(
                ApprovedParticipant.project_id == Project.id,
                ApprovedParticipant.email == request_by
            ) |
            exists().where(
                UnverifiedParticipant.project_id == Project.id,
                UnverifiedParticipant.email == request_by
            )
        ).all()

        formatted_projects = []
        for project in projects:
            if project.coordinator == request_by:
                role = "coordinator"
                project_details = {
                    "id": project.id,
                    "title": project.title,
                    "proj_domain": project.proj_domain,
                    "start_date": project.start_date.isoformat(),
                    "end_date": project.end_date.isoformat(),
                    "status": project.status,
                    "your_role": role,
                    "current_members": project.current_members_count,
                    "max_members": project.max_members_count,
                    "coordinator": project.coordinator,
                    "coordinator_role": project.coordinator_role,
                    "proj_type": project.proj_type,
                    "member_roles": project.member_roles,
                    "description": project.description,
                    "skills": project.skills,
                    "approved_participants": [
                        {
                            "email": ap.email,
                            "id": ap.id,
                            "role": ap.role,
                            "skills": ap.skills,
                            "phone_number": ap.phone_number
                        }
                        for ap in project.approved_participants
                    ],
                    "unverified_participants": [
                        {
                            "email": uvp.email,
                            "id": uvp.id,
                            "name": db_user.query(Student.name).filter(Student.email == uvp.email).scalar(),
                            "roles_applied": uvp.roles_applied,
                            "skills": uvp.skills,
                            "phone_number": uvp.phone_number
                        }
                        for uvp in project.unverified_participants
                    ],
                    "meetings": [
                        {
                            "id": meeting.id,
                            "title": meeting.title,
                            "description": meeting.description,
                            "roles": meeting.roles,
                            "meeting_type": meeting.meeting_type.value,
                            "scheduled_at": meeting.scheduled_at.isoformat(),
                            "venue": meeting.venue,
                            "meeting_link": meeting.meeting_link
                        }
                        for meeting in project.meetings
                    ]
                }
                formatted_projects.append(project_details)

        return {
            'content': {
                'type': 'ok',
                'details': f"Found {len(formatted_projects)} projects",
                'projects': formatted_projects
            }
        }

    except Exception as e:
        print(f"ERROR retrieving user projects: {e}")
        return {
            'content': {
                'type': 'error',
                'details': 'Failed to retrieve projects'
            }
        }

@router.post("/list")
def get_projects(data: GetProjectsRequest, db: Session = Depends(get_projects_db)):
    try:
        date_threshold = datetime.datetime.utcnow() - datetime.timedelta(days=60)

        all_projects = db.query(Project).filter(
            Project.start_date >= date_threshold
        ).all()

        formatted_projects = []
        for project in all_projects:
            project_data = {
                "id": project.id,
                "title": project.title,
                "coordinator": project.coordinator,
                "proj_domain": project.proj_domain,
                "start_date": project.start_date.isoformat(),
                "end_date": project.end_date.isoformat(),
                "status": project.status,
                "current_members_count": project.current_members_count,
                "max_members_count": project.max_members_count,
                "description": project.description,
                "skills": project.skills,
                "proj_type": project.proj_type,
                "coordinator_role": project.coordinator_role
            }
            formatted_projects.append(project_data)

        return {
            'content': {
                'type': "ok",
                'projects': formatted_projects
            }
        }
    except Exception as e:
        print("ERROR in projects list:", e)
        return {
            'content': {
                'type': "error",
                'details': "Failed to retrieve projects"
            }
        }

@router.post("/member/apply")
def apply_project(data: ApplyProjectRequest, 
                 db: Session = Depends(get_projects_db),
                 db_user: Session = Depends(get_users_db)):
    try:
        project = db.query(Project).filter(Project.id == data.project_id).first()
        if not project:
            return {'content': {'type': 'error', 'details': 'Project not found'}}

        existing_applicant = db.query(UnverifiedParticipant).filter(
            UnverifiedParticipant.email == data.request_by,
            UnverifiedParticipant.project_id == data.project_id
        ).first()

        if existing_applicant:
            return {'content': {'type': 'error', 'details': 'Application already submitted'}}

        approved_member = db.query(ApprovedParticipant).filter(
            ApprovedParticipant.email == data.request_by,
            ApprovedParticipant.project_id == data.project_id
        ).first()

        if approved_member:
            return {'content': {'type': 'error', 'details': 'Already a project member'}}

        if not set(data.roles).issubset(set(project.member_roles)):
            return {'content': {'type': 'error', 'details': 'Contains invalid roles'}}

        student = db_user.query(Student).filter(
            Student.email == data.request_by
        ).first()
        
        if not student:
            return {'content': {'type': 'error', 'details': 'Only students can apply'}}

        new_application = UnverifiedParticipant(
            project_id=data.project_id,
            email=student.email,
            phone_number=student.phone_number,
            roles_applied=data.roles,
            skills=data.skills
        )
        db.add(new_application)
        db.commit()
        return {'content': {'type': 'ok', 'details': 'Application submitted successfully'}}

    except Exception as e:
        db.rollback()
        print(f"ERROR applying to project: {e}")
        return {'content': {'type': 'error', 'details': 'Application failed'}}

@router.post("/member/update")
def apply_project(data: UpdateApplicationRequest, db: Session = Depends(get_projects_db), db_user: Session = Depends(get_users_db)):
    request_by = data.request_by
    roles = data.roles
    skills = data.skills
    id = data.project_id
    try:
        existing_project = db.query(Project).filter(Project.id == id).first()
        if not existing_project:
            return {'content': {'type': 'error', 'details': 'Project not found'}}
        existing_unverified_member = db.query(UnverifiedParticipant).filter(UnverifiedParticipant.email == request_by, UnverifiedParticipant.project_id == id).first()
        if not existing_unverified_member:
            return {'content': {'type': 'error', 'details': 'User application not found'}}
        else:
            member_info = db_user.query(Student).filter(Student.email == request_by).first()
            if not member_info:
                return {'content': {'type': 'error', 'details': 'Member has to be a student'}}
            for role in roles:
                if role not in existing_project.member_roles:
                    return {'content': {'type': 'error', 'details': 'Invalid roles'}}
            existing_unverified_member.phone_number=member_info.phone_number
            existing_unverified_member.roles_applied=roles
            existing_unverified_member.skills=skills
        db.commit()
        return {'content': {'type': "ok", 'details': "Application updated"}}
    except Exception as e:
        print("ERROR in applying to project:", e)
        return {'content': {'type': "error", 'details': "An error occurred"}}

@router.post("/member/withdraw")
def withdraw_application(data: WithdrawApplicationRequest, db: Session = Depends(get_projects_db)):
    request_by = data.request_by
    id = data.project_id
    try:
        existing_project = db.query(Project).filter(Project.id == id).first()
        if not existing_project:
            return {'content': {'type': 'error', 'details': 'Project not found'}}
        existing_unverified_member = db.query(UnverifiedParticipant).filter(UnverifiedParticipant.email == request_by, UnverifiedParticipant.project_id == id).first()
        print(existing_unverified_member)
        if not existing_unverified_member:
            existing_approved_member = db.query(ApprovedParticipant).filter(ApprovedParticipant.email == request_by, ApprovedParticipant.project_id == id).first()
            if not existing_approved_member:
                return {'content': {'type': 'error', 'details': 'User application not found'}}
            db.delete(existing_approved_member)
            db.commit()
        else:
            db.delete(existing_unverified_member)
            db.commit()
        return {'content': {'type': "ok", 'details': "Application withdrawed"}}
    except Exception as e:
        print("ERROR in applying to project:", e)
        return {'content': {'type': "error", 'details': "An error occurred"}}

@router.post("/member/remove")
def remove_application(data: RemoveApplicationRequest, db: Session = Depends(get_projects_db)):
    member = data.member
    request_by = data.request_by
    id = data.project_id
    try:
        existing_project = db.query(Project).filter(Project.id == id).first()
        if not existing_project:
            return {'content': {'type': 'error', 'details': 'Project not found'}}
        if existing_project.coordinator != request_by:
            return {'content': {'type': 'error', 'details': 'Unauthorized user'}}
        if existing_project.coordinator == member:
            return {'content': {'type': 'error', 'details': ':) cannot remove yourself'}}
            
        existing_unverified_member = db.query(UnverifiedParticipant).filter(UnverifiedParticipant.email == member, UnverifiedParticipant.project_id == id).first()
        if not existing_unverified_member:
            existing_approved_member = db.query(ApprovedParticipant).filter(ApprovedParticipant.email == member, ApprovedParticipant.project_id == id).first()
            if not existing_approved_member:
                return {'content': {'type': 'error', 'details': 'User application not found'}}
            db.delete(existing_approved_member)
        else:
            db.delete(existing_unverified_member)
        db.commit()
        return {'content': {'type': "ok", 'details': "Member removed"}}
    except Exception as e:
        print("ERROR in applying to project:", e)
        return {'content': {'type': "error", 'details': "An error occurred"}}

@router.post("/meeting/add")
def add_meeting(data: AddMeetingRequest, db: Session = Depends(get_projects_db)):
    project_id=data.project_id
    title=data.title
    description=data.description
    meeting_type=data.meeting_type
    scheduled_at=data.scheduled_at
    venue=data.venue
    meeting_link=data.meeting_link
    request_by = data.request_by
    roles=data.roles
    try:
        existing_project = db.query(Project).filter(Project.id == project_id).first()
        if not existing_project:
            return {'content': {'type': 'error', 'details': 'Project not found'}}
        if existing_project.coordinator != request_by:
            return {'content': {'type': 'error', 'details': 'Unauthorized user'}}
        if meeting_type == MeetingType.ONLINE:
            if not meeting_link:
                return {'content': {'type': 'error', 'details': 'Meeting link not sepecified'}}
        elif meeting_type == MeetingType.OFFLINE:
            if not meeting_link:
                return {'content': {'type': 'error', 'details': 'Meeting venue not sepecified'}}
        else:
            # critical error
            return {'content': {'type': 'error', 'details': 'Invalid meeting type'}}
        for role in roles:
            if role not in existing_project.member_roles:
                return {'content': {'type': 'error', 'details': 'Invalid member role'}}
        new_meeting = Meetings(
            project_id=project_id,
            title=title,
            description=description,
            meeting_type=meeting_type,
            scheduled_at=scheduled_at,
            meeting_link=meeting_link,
            venue=venue,
            roles=roles
        )
        db.add(new_meeting)
        db.commit()
        db.refresh(new_meeting)
        for role in roles:
            users = db.query(ApprovedParticipant).filter(ApprovedParticipant.project_id == project_id, ApprovedParticipant.role == role).all()
            for user in users:
                response = send_new_meeting_mail(to_mail=user.email, meeting=new_meeting, project_title=existing_project.title, contact_email=existing_project.coordinator)
                if response['type'] == "error":
                    return {'content': {'type': "ok", 'id': new_meeting.id, 'details': "Meeting scheduled but error in sending invitation mail"}}
        return {'content': {'type': "ok", 'id': new_meeting.id, 'details': "New meeting scheduled"}}
    except Exception as e:
        print("ERROR in adding a meeting:", e)
        return {'content': {'type': "error", 'details': "An error occurred"}}

@router.post("/meeting/delete")
def remove_meeting(data: DeleteMeetingRequest, db: Session = Depends(get_projects_db)):
    project_id=data.project_id
    meeting_id=data.meeting_id
    request_by = data.request_by
    try:
        existing_project = db.query(Project).filter(Project.id == project_id).first()
        if not existing_project:
            return {'content': {'type': 'error', 'details': 'Project not found'}}
        if existing_project.coordinator != request_by:
            return {'content': {'type': 'error', 'details': 'Unauthorized user'}}
        existing_meeting = db.query(Meetings).filter(Meetings.id == meeting_id).first()
        if not existing_meeting:
            return {'content': {'type': 'error', 'details': 'Existing scheduled meeting not found'}}
        db.delete(existing_meeting)
        db.commit()
        return {'content': {'type': "ok", 'details': "Meeting removed successfully"}}
    except Exception as e:
        print("ERROR in applying to project:", e)
        return {'content': {'type': "error", 'details': "An error occurred"}}

@router.post("/meeting/update")
def update_meeting(data: UpdateMeetingRequest, db: Session = Depends(get_projects_db)):
    meeting_id=data.meeting_id
    project_id=data.project_id
    title=data.title
    description=data.description
    meeting_type=data.meeting_type
    scheduled_at=data.scheduled_at
    venue=data.venue
    meeting_link=data.meeting_link
    request_by = data.request_by
    roles=data.roles
    try:
        existing_project = db.query(Project).filter(Project.id == project_id).first()
        if not existing_project:
            return {'content': {'type': 'error', 'details': 'Project not found'}}
        if existing_project.coordinator != request_by:
            return {'content': {'type': 'error', 'details': 'Unauthorized user'}}
        existing_meeting = db.query(Meetings).filter(Meetings.id == meeting_id).first()
        if not existing_meeting:
            return {'content': {'type': 'error', 'details': 'Meeting not found'}}
        if meeting_type == MeetingType.ONLINE:
            if not meeting_link:
                return {'content': {'type': 'error', 'details': 'Meeting link not sepecified'}}
        elif meeting_type == MeetingType.OFFLINE:
            if not meeting_link:
                return {'content': {'type': 'error', 'details': 'Meeting venue not sepecified'}}
        else:
            return {'content': {'type': 'error', 'details': 'Invalid meeting type'}}
        for role in roles:
            if role not in existing_project.member_roles:
                return {'content': {'type': 'error', 'details': 'Invalid member role'}}
        existing_meeting.project_id=project_id
        existing_meeting.title=title
        existing_meeting.description=description
        existing_meeting.meeting_type=meeting_type
        existing_meeting.scheduled_at=scheduled_at
        existing_meeting.meeting_link=meeting_link
        existing_meeting.venue=venue
        existing_meeting.roles=roles
        db.commit()
        return {'content': {'type': "ok", 'details': "Meeting updated"}}
    except Exception as e:
        print("ERROR in applying to project:", e)
        return {'content': {'type': "error", 'details': "An error occurred"}}

@router.post("/meeting/reminder")
def meeting_reminder(data: MeetingReminderRequest, db: Session = Depends(get_projects_db)):
    meeting_id=data.meeting_id
    request_by=data.request_by
    try:
        existing_meeting = db.query(Meetings).filter(Meetings.id == meeting_id).first()
        if not existing_meeting:
            return {'content': {'type': 'error', 'details': 'Meeting not found'}}
        existing_project = db.query(Project).filter(Project.id == existing_meeting.project_id).first()
        if not existing_project:
            return {'content': {'type': 'error', 'details': 'Project not found'}}
        if existing_project.coordinator != request_by:
            return {'content': {'type': 'error', 'details': 'Unauthorized user'}}
        members = db.query(ApprovedParticipant).filter(ApprovedParticipant.project_id == existing_project.id).all()
        users = [member.email for member in members]
        response = send_meeting_reminder_mail(to_mail=users[0], meeting=existing_meeting, project_title=existing_project.title, contact_email=existing_project.coordinator, cc=users[1:])
        return {'content': response}
    except Exception as e:
        print("ERROR in applying to project:", e)
        return {'content': {'type': "error", 'details': "An error occurred"}}

from src.schemas.request import MeetingReminderRequest, UpdateMeetingRequest, DeleteMeetingRequest, MeetingType, AddMeetingRequest, RemoveApplicationRequest, WithdrawApplicationRequest, UpdateApplicationRequest, GetProjectsRequest, GetProjectRequest, UpdateProjectRequest, DeleteProjectRequest, AddProjectRequest, ShortlistRequest, ApplyProjectRequest
from src.models.projects import Project, ApprovedParticipant, UnverifiedParticipant, Meetings
from src.models.users import Student, Club
from src.database.connection import get_projects_db, get_users_db
from src.utils.mail import send_meeting_reminder_mail, send_new_meeting_mail
from fastapi.responses import RedirectResponse
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import datetime

router = APIRouter()

@router.post("/add")
def add_project(data: AddProjectRequest, db: Session = Depends(get_projects_db), db_user: Session = Depends(get_users_db)):
    proj_type = data.proj_type
    member_roles = data.member_roles
    proj_domain = data.proj_domain
    title = data.title
    description = data.description
    start_date = data.start_date
    duration = data.duration
    skills = data.skills
    max_members_count = data.max_members_count
    request_by = data.request_by
    try:
        new_project = Project(
            coordinator=request_by,
            proj_type=proj_type,
            member_roles=member_roles,
            proj_domain=proj_domain,
            title=title,
            description=description,
            start_date=start_date,
            duration=duration,
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
                phone_number=coordinator.phone_number
            )
            db.add(participant)
            db.commit()
        else:
            coordinator = db_user.query(Club).filter(Club.email == request_by).first()
            participant = ApprovedParticipant(
                project_id=new_project.id,
                email=coordinator.email,
                role="coordinator"
            )
            db.add(participant)
            db.commit()
        return {'content':{'type': "ok", 'id': new_project.id, 'details': "New project added"}}
    except Exception as e:
        print("ERROR in add event:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

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

@router.post("/list")
def get_projects(data: GetProjectsRequest, db: Session = Depends(get_projects_db)):
    try:
        all_projects = db.query(Project).filter(Project.start_date >= datetime.datetime.utcnow() - datetime.timedelta(days=25)).all()
        return {'content':{'type': "ok", 'projects': all_projects}}
    except Exception as e:
        print("ERROR in projects list:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/project")
def get_event(data: GetProjectRequest, db: Session = Depends(get_projects_db)):
    id = data.id
    try:
        event = db.query(Project).filter(Project.id == id).first()
        return {'type': "ok", 'events': event}
    except Exception as e:
        print("ERROR in an project:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

@router.post("/update")
def update_event(data: UpdateProjectRequest, db: Session = Depends(get_projects_db)):
    id = data.id
    proj_type = data.proj_type
    member_roles = data.member_roles
    proj_domain = data.proj_domain
    title = data.title
    description = data.description
    start_date = data.start_date
    duration = data.duration
    skills = data.skills
    max_members_count = data.max_members_count
    current_members_count = data.current_members_count
    request_by = data.request_by
    try:
        existing_project = db.query(Project).filter(Project.id == id).first()
        if not existing_project:
            return {'content':{'type': 'error', 'details': 'Project not found'}}
        if existing_project.coordinator != request_by:
            return {'content':{'type': 'error', 'details': 'Unauthorized coordinator'}}
        
        existing_project.proj_type = proj_type
        existing_project.member_roles = member_roles
        existing_project.proj_domain = proj_domain
        existing_project.title = title
        existing_project.description = description
        existing_project.start_date = start_date
        existing_project.duration = duration
        existing_project.skills = skills
        existing_project.max_members_count = max_members_count
        existing_project.current_members_count = current_members_count
        db.commit()
        return {'content':{'type': "ok", 'project': existing_project}}
    except Exception as e:
        print("ERROR in an updating project:", e)
        return {'content':{'type': "error", 'details':"An error occurred"}}

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

@router.post("/member/apply")
def apply_project(data: ApplyProjectRequest, db: Session = Depends(get_projects_db), db_user: Session = Depends(get_users_db)):
    request_by = data.request_by
    roles = data.roles
    skills = data.skills
    id = data.project_id
    try:
        existing_project = db.query(Project).filter(Project.id == id).first()
        if not existing_project:
            return {'content': {'type': 'error', 'details': 'Project not found'}}
        unverified_member = db.query(UnverifiedParticipant).filter(UnverifiedParticipant.email == request_by, UnverifiedParticipant.project_id == id).first()
        if unverified_member:
            return {'content': {'type': 'error', 'details': 'User has already applied'}}
        else:
            for role in roles:
                if role not in existing_project.member_roles:
                    return {'content': {'type': 'error', 'details': 'Invalid roles'}}
            member_info = db_user.query(Student).filter(Student.email == request_by).first()
            if not member_info:
                return {'content': {'type': 'error', 'details': 'Member has to be a student'}}
            member = UnverifiedParticipant(
                project_id=id,
                email=member_info.email,
                phone_number=member_info.phone_number,
                roles_applied=roles,
                skills=skills
            )
            db.add(member)
        db.commit()
        return {'content': {'type': "ok", 'details': "Application submitted"}}
    except Exception as e:
        print("ERROR in applying to project:", e)
        return {'content': {'type': "error", 'details': "An error occurred"}}

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

@router.post("/meeting/remove")
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
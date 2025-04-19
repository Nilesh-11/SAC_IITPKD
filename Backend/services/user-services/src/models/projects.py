from src.database.connection import BaseProjects
from sqlalchemy import Column, Integer, String, Text, Date, Enum, ForeignKey, Interval, DateTime
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
import datetime
import enum

class MeetingType(enum.Enum):
    ONLINE = "online"
    OFFLINE = "offline"

class Project(BaseProjects):
    __tablename__ = 'projects'

    id = Column(Integer, primary_key=True, autoincrement=True)
    coordinator = Column(String(50), nullable=False)
    coordinator_role = Column(String(50), nullable=False)
    proj_type = Column(String(50), nullable=False)  # E.g., Research, Software, Business
    member_roles = Column(ARRAY(String), nullable=True)
    proj_domain = Column(String(100), nullable=False)  # E.g., AI, Web Dev, ML
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    skills = Column(ARRAY(String), nullable=True)
    max_members_count = Column(Integer, nullable=False)
    current_members_count = Column(Integer, nullable=False, default=1)

    approved_participants = relationship('ApprovedParticipant', back_populates="project", cascade="all, delete-orphan")
    unverified_participants = relationship('UnverifiedParticipant', back_populates="project", cascade="all, delete-orphan")
    meetings = relationship('Meetings', back_populates='project', cascade="all, delete-orphan")

    @hybrid_property
    def status(self):
        now = datetime.datetime.utcnow()
        project_start = datetime.datetime.combine(self.start_date, datetime.time(0, 0))
        project_end = datetime.datetime.combine(self.end_date, datetime.time(0, 0))
        if now < project_start:
            return "upcoming"
        elif project_start <= now < project_end:
            return "ongoing"
        else:
            return "completed"
class UnverifiedParticipant(BaseProjects):
    __tablename__ = 'unverified_participants'

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    email = Column(String(100), nullable=False)
    roles_applied = Column(ARRAY(String), nullable=True)
    skills = Column(ARRAY(String), nullable=True)
    phone_number = Column(String(15), nullable=True)
    project = relationship('Project', back_populates='unverified_participants')

class ApprovedParticipant(BaseProjects):
    __tablename__ = 'approved_participants'

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    email = Column(String(100), nullable=False)
    role = Column(String(50), nullable=False)
    skills = Column(ARRAY(String), nullable=True)
    phone_number = Column(String(15), nullable=True)
    project = relationship('Project', back_populates='approved_participants')

class Meetings(BaseProjects):
    __tablename__ = 'meetings'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(String, nullable=False)
    roles = Column(ARRAY(String), nullable=True)
    meeting_type = Column(Enum(MeetingType, name="meeting_type_enum"), nullable=False)
    scheduled_at = Column(DateTime, nullable=False)
    venue = Column(String(100), nullable=True)
    meeting_link = Column(String(100), nullable=True)
    project = relationship('Project', back_populates='meetings')

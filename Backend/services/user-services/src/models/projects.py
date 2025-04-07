from src.database.connection import BaseProjects
from sqlalchemy import Column, Integer, String, Text, Date, Enum, ForeignKey, Interval
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship

class Project(BaseProjects):
    __tablename__ = 'projects'

    id = Column(Integer, primary_key=True, autoincrement=True)
    coordinator = Column(String(50), nullable=False)
    proj_type = Column(String(50), nullable=False)  # E.g., Research, Software, Business
    member_roles = Column(ARRAY(String), nullable=True)
    proj_domain = Column(String(100), nullable=False)  # E.g., AI, Web Dev, ML
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(Date, nullable=False)
    duration = Column(Interval, nullable=False)
    skills = Column(ARRAY(String), nullable=True)
    status = Column(Enum('upcoming', 'ongoing', 'completed'), nullable=False, default='upcoming')
    max_members_count = Column(Integer, nullable=False)
    current_members_count = Column(Integer, nullable=False, default=1)

class UnverifiedParticipant(BaseProjects):
    __tablename__ = 'unverified_participants'

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    email = Column(String(100), nullable=False)
    roles_applied = Column(ARRAY(String), nullable=True)
    skills = Column(ARRAY(String), nullable=True)
    phone_number = Column(String(15), nullable=False)
    project = relationship('Project', backref='unverified_participants')

class ApprovedParticipant(BaseProjects):
    __tablename__ = 'approved_participants'

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    email = Column(String(100), nullable=False)
    role = Column(String(50), nullable=False)
    skills = Column(ARRAY(String), nullable=True)
    phone_number = Column(String(15), nullable=False)
    project = relationship('Project', backref='approved_participants')

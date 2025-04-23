from src.database.connection import BaseUser
from sqlalchemy import Table, Column, Integer, String, DateTime, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

class UserRole(enum.Enum):
    student = "student"
    club = "club"
    council = "council"
    admin = "admin"

club_coheads_association = Table(
    'club_coheads_association',
    BaseUser.metadata,
    Column('club_id', Integer, ForeignKey('clubs.id', ondelete="CASCADE"), primary_key=True),
    Column('student_id', Integer, ForeignKey('students.id', ondelete="CASCADE"), primary_key=True)
)

council_deputy_association = Table(
    'council_deputy_association',
    BaseUser.metadata,
    Column('council_id', Integer, ForeignKey('councils.id', ondelete="CASCADE"), primary_key=True),
    Column('student_id', Integer, ForeignKey('students.id', ondelete="CASCADE"), primary_key=True)
)

class Admin(BaseUser):
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    registered_date = Column(DateTime, default=datetime.utcnow())
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)

class Student(BaseUser):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    registered_date = Column(DateTime, default=datetime.utcnow())
    email = Column(String, unique=True, index=True, nullable=False)
    batch = Column(String, nullable=True)
    department = Column(String, nullable=True)
    stream = Column(String, nullable=True)
    degree_level = Column(String, nullable=False, server_default="BTech")
    password_hash = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)

    club_memberships = relationship(
        "ClubMembership",
        back_populates="student",
        cascade="all, delete-orphan",
        passive_deletes=True
    )
    
    cohead_clubs = relationship(
        "Club",
        secondary=club_coheads_association,
        back_populates="coheads"
    )

    secretary_of_council = relationship(
        "Council",
        back_populates="secretary",
        foreign_keys="Council.secretary_id",
        uselist=False
    )

    deputy_of_council = relationship(
        "Council",
        secondary="council_deputy_association",
        back_populates="deputy_ids"
    )

class Council(BaseUser):
    __tablename__ = "councils"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False, unique=True)
    title = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=False, unique=True)
    faculty_advisor = Column(String, nullable=True)
    
    secretary_id = Column(Integer, ForeignKey('students.id', ondelete="SET NULL"), nullable=True) 
    
    deputy_ids = relationship(
        'Student',
        secondary="council_deputy_association",
        back_populates="deputy_of_council"
    )
    
    secretary = relationship("Student", back_populates="secretary_of_council", foreign_keys=[secretary_id])
    
    website = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow())
    updated_at = Column(DateTime, default=datetime.utcnow(), onupdate=datetime.utcnow())

    clubs = relationship('Club', back_populates='council', cascade="all, delete-orphan")


class Club(BaseUser):
    __tablename__ = "clubs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    
    faculty_advisor = Column(String, unique=True, index=True, nullable=False)

    head_id = Column(Integer, ForeignKey("students.id", ondelete="SET NULL"), nullable=True)
    registered_date = Column(DateTime, default=datetime.utcnow())
    website = Column(String(100), nullable=True)
    council_id = Column(Integer, ForeignKey('councils.id'))

    council = relationship('Council', back_populates='clubs')
    memberships = relationship(
        "ClubMembership",
        back_populates="club",
        cascade="all, delete-orphan",
        passive_deletes=True
    )
    
    custom_roles = relationship(
        "ClubRole",
        back_populates="club",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    head = relationship("Student", foreign_keys=[head_id])
    coheads = relationship(
        "Student",
        secondary=club_coheads_association,
        back_populates="cohead_clubs"
    )

class ClubMembership(BaseUser):
    __tablename__ = "club_memberships"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="RESTRICT"), nullable=False)
    club_id = Column(Integer, ForeignKey("clubs.id", ondelete="CASCADE"), nullable=False)
    role_id = Column(Integer, ForeignKey("club_roles.id", ondelete="CASCADE"), nullable=True)
    joined_date = Column(DateTime, default=datetime.utcnow())
    updated_date = Column(DateTime, default=datetime.utcnow(), onupdate=datetime.utcnow)

    student = relationship("Student", back_populates="club_memberships")
    club = relationship("Club", back_populates="memberships")
    role = relationship("ClubRole", back_populates="memberships")

class ClubRole(BaseUser):
    __tablename__ = "club_roles"
    __table_args__ = (UniqueConstraint("club_id", "title", name="_club_role_uc"),)

    id = Column(Integer, primary_key=True, index=True)
    club_id = Column(Integer, ForeignKey("clubs.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    privilege=Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow())
    updated_at = Column(DateTime, default=datetime.utcnow(), onupdate=datetime.utcnow())

    club = relationship("Club", back_populates="custom_roles")
    memberships = relationship(
        "ClubMembership", 
        back_populates="role", 
        cascade="all, delete-orphan",  # Added cascade
        passive_deletes=True
    )

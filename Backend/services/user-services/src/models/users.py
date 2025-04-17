from src.database.connection import BaseUser
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from datetime import datetime

class Student(BaseUser):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name=Column(String)
    registered_date=Column(DateTime, default=datetime.utcnow())
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)

class Council(BaseUser):
    __tablename__ = "councils"
    
    id=Column(Integer, primary_key=True, index=True)
    email=Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name=Column(String, nullable=False, unique=True)
    description=Column(Text, nullable=False, unique=True)
    faculty_advisor=Column(String, unique=True, index=True, nullable=False)
    secretary=Column(String, nullable=False)
    deputy=Column(ARRAY(String), nullable=True)
    website=Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    clubs = relationship('Club', back_populates='council', cascade="all, delete-orphan")

class Club(BaseUser):
    __tablename__ = "clubs"
    
    id=Column(Integer, primary_key=True, index=True)
    name=Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    faculty_advisor=Column(String, unique=True, index=True, nullable=False)
    head = Column(String, nullable=True)
    coheads = Column(ARRAY(String), nullable=True)
    leads = Column(ARRAY(String), nullable=True)
    members = Column(ARRAY(String), nullable=True)
    registered_date=Column(DateTime, default=datetime.utcnow())
    website=Column(String(100), nullable=True)
    council_id = Column(Integer, ForeignKey('councils.id'))
    council = relationship('Council', back_populates='clubs')

class Admin(BaseUser):
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    name=Column(String)
    registered_date=Column(DateTime, default=datetime.utcnow())
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)


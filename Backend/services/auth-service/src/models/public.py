from src.database.connection import BasePublic
from sqlalchemy import Column, Integer, String,Enum, DateTime
from sqlalchemy.ext.hybrid import hybrid_property
from src.models.users import UserRole
import datetime
import enum

class AnnouncementPriority(enum.Enum):
    low = "low"
    normal = "normal"
    high = "high"
    critical = "critical"

class Announcements(BasePublic):
    __tablename__ = "announcements"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    body = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    priority = Column(Enum(AnnouncementPriority), default=AnnouncementPriority.normal)
    author = Column(String(50), nullable=False)
    author_role = Column(Enum(UserRole), default=UserRole.admin)
    
    @hybrid_property
    def is_expired(self):
        if self.expires_at:
            return datetime.datetime.utcnow() > self.expires_at
        return False
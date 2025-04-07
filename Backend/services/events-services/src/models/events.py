from src.database.connection import BaseEvents
from sqlalchemy import Column, Integer, String, Boolean, Enum, Text, Date, Time, Interval, DateTime
from sqlalchemy.ext.hybrid import hybrid_property
import datetime

class Event(BaseEvents):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    organizer = Column(String, nullable=False)
    registered_by = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    event_timestamp = Column(DateTime, nullable=False)
    duration = Column(Interval, nullable=False)
    venue = Column(String, nullable=False)
    cancelled = Column(Boolean, default=False)

    @hybrid_property
    def event_status(self):
        now = datetime.datetime.now()
        event_start = datetime.datetime.combine(self.event_date, self.event_time)
        event_end = event_start + self.duration

        if now < event_start:
            return "upcoming"
        elif event_start <= now < event_end:
            return "ongoing"
        else:
            return "completed"

class EventParticipant(BaseEvents):
    __tablename__ = "event_participants"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, index=True, nullable=False)
    phone_number = Column(String, nullable=True)

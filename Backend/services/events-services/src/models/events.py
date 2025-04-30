from src.database.connection import BaseEvents
from sqlalchemy import Column, Integer, String, Boolean, Enum, Text, Date, Time, Interval, DateTime
from sqlalchemy.ext.hybrid import hybrid_property
import datetime

class Event(BaseEvents):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    organizer = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    venue = Column(String, nullable=False)
    registered_by = Column(String, nullable=False)
    council = Column(String, nullable=False)
    cancelled = Column(Boolean, default=False)

    @hybrid_property
    def event_status(self):
        current_time = datetime.datetime.now()
        return "upcoming" if current_time < self.start_time else \
                    "ongoing" if current_time < self.end_time else "completed"
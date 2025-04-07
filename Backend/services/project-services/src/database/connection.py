from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from src.config.config import EVENTS_DATABASE_URL, USERS_DATABASE_URL, PROJECTS_DATABASE_URL

engine_project = create_engine(PROJECTS_DATABASE_URL, pool_size=10, max_overflow=5, pool_timeout=30, pool_recycle=1800, echo=True)
SessionProjects = sessionmaker(autocommit=False, autoflush=False, bind=engine_project)

engine_event = create_engine(EVENTS_DATABASE_URL, pool_size=5, max_overflow=2, pool_timeout=20, pool_recycle=1800, echo=True)
SessionEvents = sessionmaker(autocommit=False, autoflush=False, bind=engine_event)

engine_user = create_engine(USERS_DATABASE_URL, pool_size=5, max_overflow=2, pool_timeout=20, pool_recycle=1800, echo=True)
SessionUsers = sessionmaker(autocommit=False, autoflush=False, bind=engine_user)

BaseEvents = declarative_base()
BaseUser = declarative_base()
BaseProjects = declarative_base()

def get_projects_db():
    db = SessionProjects()
    try:
        yield db
    finally:
        db.close()

def get_events_db():
    db = SessionEvents()
    try:
        yield db
    finally:
        db.close()

def get_users_db():
    db = SessionUsers()
    try:
        yield db
    finally:
        db.close()
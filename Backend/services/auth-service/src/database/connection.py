from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from src.config.config import USERS_DATABASE_URL, AUTH_DATABASE_URL

engine_auth = create_engine(AUTH_DATABASE_URL, pool_size=10, max_overflow=5, pool_timeout=30, pool_recycle=1800, echo=True)
SessionAuth = sessionmaker(autocommit=False, autoflush=False, bind=engine_auth)

engine_users = create_engine(USERS_DATABASE_URL, pool_size=5, max_overflow=2, pool_timeout=20, pool_recycle=1800, echo=True)
SessionUsers = sessionmaker(autocommit=False, autoflush=False, bind=engine_users)

BaseAuth = declarative_base()
BaseUser = declarative_base()

def get_users_db():
    db = SessionUsers()
    try:
        yield db
    finally:
        db.close()

def get_auth_db():
    db = SessionAuth()
    try:
        yield db
    finally:
        db.close()
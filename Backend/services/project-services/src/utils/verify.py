from src.models.users import Student, Club
from sqlalchemy.orm import Session
from sqlalchemy.sql import exists
from src.config.config import logger

def validate_password(value: str) -> str:
    if not any(char.isdigit() for char in value):
        raise ValueError("Password must contain at least one digit.")
    if not any(char.islower() for char in value):
        raise ValueError("Password must contain at least one lowercase letter.")
    if not any(char.isupper() for char in value):
        raise ValueError("Password must contain at least one uppercase letter.")
    if not any(not char.isalnum() for char in value):
        raise ValueError("Password must contain at least one special character.")
    return value

def validate_mail(email: str) -> bool:
    if not email.lower().endswith("iitpkd.ac.in"):
        raise ValueError("Invalid mail.")
    return email

def verify_user(email: str, db: Session) -> bool:
    try:
        user_exists = db.query(exists().where(Student.email == email)).scalar()
        club_exists = db.query(exists().where(Club.email == email)).scalar()

        return user_exists or club_exists
    except Exception as e:
        logger.error(f"Database error while verifying user: {e}")
        return False
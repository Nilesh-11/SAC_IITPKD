from sqlalchemy.orm import Session
from src.models.user import Student

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
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        return True
    else:
        existing_user = db.query(Club).filter(Club.email == email).first()
        if existing_user:
            return True
    return False
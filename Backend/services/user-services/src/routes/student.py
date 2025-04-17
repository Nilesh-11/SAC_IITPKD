
from src.utils.auth import hash_password
from src.models.users import Student
from src.database.connection import get_users_db
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import datetime

router = APIRouter()

# @router.post("/save-password")
# def forgot_password(data: SavePasswordRequest, db_user: Session = Depends(get_users_db)):
#     email = data.email
#     token = data.token
#     password = data.password
#     hashed_password = hash_password(password)

#     try:
#         existing_user = db_user.query(Student).filter(Student.email == email).first()
#         if not existing_user:
#             return {'content':{'type': "error", 'details': "Student not found, sign up first"}}
#         data = verify_jwt(token)
#         if not data:
#             return {'content':{'type': "error", 'details': "Unauthorized user"}}
#         existing_user.password_hash = hashed_password
#         db_user.commit()
#         return {'content':{'type': "ok", 'details': "password saved successfully"}}
#     except Exception as e:
#         print("Error in log in:", e)
#         return {'content':{"type": "error", "detail": "An error occurred with login", 'status_code': 500}}
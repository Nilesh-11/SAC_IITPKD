from src.utils.auth import hash_password
from src.utils.jwt import create_jwt
from src.models.users import Council
from src.schemas.request import LoginRequest
from src.database.connection import get_users_db
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/login")
def user_login(data: LoginRequest, db_user: Session = Depends(get_users_db)):
    email = data.email
    password = data.password
    password_hash = hash_password(password)
    try:
        existing_user = db_user.query(Council).filter(Council.email == email, Council.password_hash == password_hash).first()
        if not existing_user:
            return JSONResponse(
                content={'type': "error", 'details': "Council not found"},
                status_code=404
            )
        token = create_jwt(email=existing_user.email, id=str(existing_user.id), role="council", aud="internal")
        return JSONResponse(content={
            'type': "ok",
            'token': token,
            'council': {
                'email': existing_user.email,
                'name': existing_user.name,
                'title': existing_user.title
            }
        })
    except Exception as e:
        print("Error in log in:", e)
        return JSONResponse(
            content={
                'type': "error",
                'details': "An error occurred with login"
            },
            status_code=500
        )

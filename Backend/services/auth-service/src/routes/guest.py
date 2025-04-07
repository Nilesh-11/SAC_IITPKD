from src.utils.jwt import create_jwt, verify_jwt
from fastapi import APIRouter
from src.schemas.request import TestRequest

router = APIRouter()

@router.post("")
def signin():
    token = create_jwt(email=None, id="0", role="guest", aud="public")
    return {'content':{'type': "ok", 'token': token, 'role': "guest"}}
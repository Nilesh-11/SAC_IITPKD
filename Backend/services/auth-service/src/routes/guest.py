from src.utils.jwt import create_jwt, verify_jwt
from fastapi import APIRouter
from fastapi.responses import JSONResponse
router = APIRouter()

@router.post("/login")
def signin():
    token = create_jwt(email=None, id="0", role="guest", aud="public")
    return JSONResponse(content={'type': "ok", 'token': token, 'role': "guest"})
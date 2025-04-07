from fastapi import APIRouter, Request
from src.schemas.auth import UsersRequest
from src.services.public_service import forward_public_request
from src.middleware.authenticate import authenticate_jwt

router = APIRouter()

@router.post("/{path:path}")
async def users(path: str, data: UsersRequest):
    data_dict = data.model_dump()
    response = await forward_public_request(f"/{path}", data_dict)
    return response

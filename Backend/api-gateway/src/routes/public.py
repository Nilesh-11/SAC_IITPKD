from fastapi import APIRouter, Request
from src.schemas.auth import UsersRequest
from src.services.public_service import forward_public_request
from src.config import limiter
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/{path:path}")
@limiter.limit("50/minute")
async def users(path: str, request: Request, data: UsersRequest):
    data_dict = data.model_dump()
    return await forward_public_request(f"/{path}", data_dict)

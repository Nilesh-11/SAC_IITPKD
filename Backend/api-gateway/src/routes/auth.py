from fastapi import APIRouter, Request
from src.schemas.auth import AuthRequest
from src.services.auth_service import forward_auth_request
from src.config import limiter

router = APIRouter()

@router.post("/{path:path}")
@limiter.limit("50/minute")
async def signup(path: str, request: Request, data: AuthRequest):
    ip_address = request.client.host
    user_agent = request.headers.get("user-agent", "Unknown")
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        ip_address = forwarded_for.split(",")[0]
    data_dict = data.model_dump()
    data_dict["ip_addr"] = ip_address
    data_dict["user_agent"] = user_agent
    return await forward_auth_request(f"/{path}", data_dict)

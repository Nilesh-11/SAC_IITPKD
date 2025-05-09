from fastapi import APIRouter, Depends, Request
from src.utils.jwt import get_token_from_header
from src.schemas.auth import ProjectsRequest
from src.services.projects_service import forward_projects_request
from src.middleware.authenticate import authenticate_jwt
from src.config import limiter

router = APIRouter()

@router.post("/{path:path}")
@limiter.limit("50/120minute")
async def projects_request(path: str, request: Request, data: ProjectsRequest, token: str = Depends(get_token_from_header)):
    payload = authenticate_jwt(token)['content']
    if payload['type'] != "ok":
        return {'content': {'type': "navigate", 'details': 'login'}}
    payload = payload['data']

    data_dict = data.model_dump()
    data_dict['request_by'] = payload['email']
    return await forward_projects_request(f"/{path}", data_dict)

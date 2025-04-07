from fastapi import APIRouter, Request, Depends
from src.schemas.auth import UsersRequest
from src.services.projects_service import forward_projects_request
from src.middleware.authenticate import authenticate_jwt
from src.utils.jwt import get_token_from_header

router = APIRouter()

@router.post("/{path:path}")
async def users(path: str, data: UsersRequest, token: str = Depends(get_token_from_header)):
    payload = authenticate_jwt(token)['content']
    if payload['type'] != "ok":
        return {'type': "navigate", 'details': 'login'}
    payload = payload['data']

    data_dict = data.model_dump()
    data_dict['request_by'] = payload['email']
    response = await forward_projects_request(f"/{path}", data_dict)
    return response

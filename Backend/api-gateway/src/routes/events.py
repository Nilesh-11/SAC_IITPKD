from fastapi import APIRouter, Depends
from src.schemas.auth import EventsRequest
from src.services.events_service import forward_events_request
from src.middleware.authenticate import authenticate_jwt
from src.utils.jwt import get_token_from_header

router = APIRouter()

@router.post("/{path:path}")
async def events(path: str, data: EventsRequest, token: str = Depends(get_token_from_header)):
    payload = authenticate_jwt(token)['content']
    if payload['type'] != "ok":
        return {'type': "navigate", 'details': 'login'}
    payload = payload['data']

    data_dict = data.model_dump()
    data_dict['request_by'] = payload['email']
    response = await forward_events_request(f"/{path}", data_dict)
    return response

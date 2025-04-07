from fastapi import Request, HTTPException, Header, status
from typing import Optional

def get_token_from_header(authorization: Optional[str] = Header(None)) -> str:
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing Authorization header"
        )
    return authorization.split(" ")[1]

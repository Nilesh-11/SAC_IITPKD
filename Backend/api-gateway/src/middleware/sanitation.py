from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, HTTPException

class ValidateRequestMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method in ["POST", "PUT"]:
            content_type = request.headers.get("Content-Type")
            if content_type != "application/json":
                raise HTTPException(status_code=415, detail="Unsupported Media Type")
            body = await request.body()
            if len(body) > 1_000_000:
                raise HTTPException(status_code=413, detail="Request entity too large")
        return await call_next(request)
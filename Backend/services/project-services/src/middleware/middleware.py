import time
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, HTTPException
from src.config.config import logger
from src.utils.verify import verify_user
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from database.connection import SessionUsers

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_method = request.method
        path = request.url.path
        allowed_methods = ["GET", "POST", "PUT", "DELETE"]
        if request_method not in allowed_methods:
            return JSONResponse(content={'type': "error", 'details': "Method Not Allowed"}, status_code=405)
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        logger.info(f"Request: {request_method} {path} - {process_time:.2f}s")    
        return response
    
class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request.state.db = SessionUsers()
        request_by = request.headers.get("request_by")
        if not request_by or not verify_user(request_by, request.state.db):
            logger.critical(f"Unauthorized Request: {request.method} {request.url.path}, Possible RSA key compromise")
            request.state.db.close()
            raise HTTPException(status_code=401, detail="Unauthorized User")
        response = await call_next(request)
        request.state.db.close()
        return response

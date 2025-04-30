import time
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from src.config.config import logger
from fastapi.responses import JSONResponse
from src.database.connection import SessionUsers

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_method = request.method
        path = request.url.path
        allowed_methods = ["POST"]
        if request_method not in allowed_methods:
            return JSONResponse(content={'type': "error", 'details': "Method Not Allowed"}, status_code=405)
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        logger.info(f"Request: {request_method} {path} - {process_time:.2f}s")    
        return response

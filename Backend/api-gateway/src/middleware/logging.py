import time
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from config import logger

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        ip_address = request.client.host
        user_agent = request.headers.get("user-agent", "Unknown")
        request_method = request.method
        path = request.url.path

        allowed_methods = ["GET", "POST", "PUT", "DELETE"]
        if request_method not in allowed_methods:
            return { 'type': "error", 'details': "Method Not Allowed", 'status_code':405 }
        
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        
        logger.info(f"Request: {request.method} {request.url.path} - {process_time:.2f}s")
        
        return response

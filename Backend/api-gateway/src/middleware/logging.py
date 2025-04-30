import time
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from src.config import logger
from fastapi.responses import JSONResponse
from fastapi import status

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_method = request.method
        allowed_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
        if request_method not in allowed_methods:
            return JSONResponse(
                content={"type": "error", "details": "Method Not Allowed"},
                status_code=status.HTTP_405_METHOD_NOT_ALLOWED
            )
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        logger.info(f"Request: {request.method} {request.url.path} - {process_time:.2f}s")
        return response

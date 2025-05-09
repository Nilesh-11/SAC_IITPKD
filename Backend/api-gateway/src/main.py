from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from starlette.responses import JSONResponse
from src.routes import auth, events, projects, user, public
from src.middleware.authenticate import authenticate_jwt
from src.middleware.sanitation import ValidateRequestMiddleware
from src.middleware.logging import LoggingMiddleware
from src.utils.jwt import get_token_from_header
from src.config import limiter

app = FastAPI(title="API Gateway")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, lambda r, e: JSONResponse(
    status_code=429, content={"details": "Rate limit exceeded"})
)

app.include_router(auth.router, prefix="/api/auth")
app.include_router(events.router, prefix="/api/events")
app.include_router(projects.router, prefix="/api/projects")
app.include_router(user.router, prefix="/api/user")
app.include_router(public.router, prefix="/api/public")

app.add_middleware(SlowAPIMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
app.add_middleware(ValidateRequestMiddleware)
app.add_middleware(LoggingMiddleware)

@app.get("/")
@limiter.limit("5/5minute")
def health_check(request: Request):
    return JSONResponse(
                content= {
                    "status": "Event Service is running"
                }
            )

@app.post("/api/verify-token")
@limiter.limit("40/120minute")
def verify_jwt(request: Request, token: str = Depends(get_token_from_header)):
    return JSONResponse(content=authenticate_jwt(token))
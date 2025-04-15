from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from src.routes import auth, events, projects, user, public
from src.middleware.authenticate import authenticate_jwt
from src.utils.jwt import get_token_from_header
app = FastAPI(title="API Gateway")

app.include_router(auth.router, prefix="/api/auth")
app.include_router(events.router, prefix="/api/events")
app.include_router(projects.router, prefix="/api/projects")
app.include_router(user.router, prefix="/api/user")
app.include_router(public.router, prefix="/api/public")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "API Gateway is running"}

@app.post("/api/verify-token")
def verify_jwt(token: str = Depends(get_token_from_header)):
    return authenticate_jwt(token)
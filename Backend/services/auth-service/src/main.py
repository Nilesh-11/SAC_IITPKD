from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes import guest, club, student, guest
from src.database.connection import BaseAuth, engine_auth

app = FastAPI(title="Auth Service")

BaseAuth.metadata.create_all(bind=engine_auth)

app.include_router(student.router, prefix="/student")
app.include_router(club.router, prefix="/club")
app.include_router(guest.router, prefix="/guest")

@app.get("/")
def health_check():
    return {"status": "Auth Service is running"}

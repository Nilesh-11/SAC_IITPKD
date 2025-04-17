from fastapi import FastAPI
from src.routes import admin, student, council, club
from src.database.connection import BaseUser, engine_user

app = FastAPI(title="Projects Service")

BaseUser.metadata.create_all(bind=engine_user)

app.include_router(student.router, prefix="/student")
app.include_router(club.router, prefix="/club")
app.include_router(council.router, prefix="/council")
app.include_router(admin.router, prefix="/admin")

@app.get("/")
def health_check():
    return {"status": "Event Service is running"}

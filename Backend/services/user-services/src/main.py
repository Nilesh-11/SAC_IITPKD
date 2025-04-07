from fastapi import FastAPI
from src.routes import user
from src.database.connection import BaseUser, engine_user

app = FastAPI(title="Projects Service")

BaseUser.metadata.create_all(bind=engine_user)

app.include_router(user.router)

@app.get("/")
def health_check():
    return {"status": "Event Service is running"}

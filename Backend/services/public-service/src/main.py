from fastapi import FastAPI
from src.routes import public
from src.database.connection import BasePublic, engine_public

app = FastAPI(title="Public Service")

BasePublic.metadata.create_all(bind=engine_public)

app.include_router(public.router)

@app.get("/")
def health_check():
    return {"status": "Public Service is running"}

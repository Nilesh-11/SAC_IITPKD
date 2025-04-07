from fastapi import FastAPI
from src.routes import events
from src.database.connection import BaseEvents, engine_event

app = FastAPI(title="Event Service")

BaseEvents.metadata.create_all(bind=engine_event)

app.include_router(events.router)

@app.get("/")
def health_check():
    return {"status": "Event Service is running"}

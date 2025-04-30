from fastapi import FastAPI
from fastapi.responses import JSONResponse
from src.middleware.middleware import LoggingMiddleware
from src.routes import events
from src.database.connection import BaseEvents, engine_event

app = FastAPI(title="Event Service")

BaseEvents.metadata.create_all(bind=engine_event)

app.add_middleware(LoggingMiddleware)
app.include_router(events.router)

@app.get("/")
def health_check():
    return JSONResponse(content={"status": "Event Service is running"})

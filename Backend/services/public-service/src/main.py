from src.database.connection import BasePublic, engine_public
from src.middleware.middleware import LoggingMiddleware
from src.routes import public
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI(title="Public Service")

BasePublic.metadata.create_all(bind=engine_public)

app.add_middleware(LoggingMiddleware)
app.include_router(public.router)

@app.get("/")
def health_check():
    return JSONResponse(
                content= {
                    "status": "Event Service is running"
                }
            )

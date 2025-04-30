from fastapi import FastAPI
from fastapi.responses import JSONResponse
from src.middleware.middleware import LoggingMiddleware
from src.routes import projects
from src.database.connection import BaseProjects, engine_project

app = FastAPI(title="Projects Service")

BaseProjects.metadata.create_all(bind=engine_project)

app.add_middleware(LoggingMiddleware)
app.include_router(projects.router)

@app.get("/")
def health_check():
    return JSONResponse(content={"status": "Project Service is running"})

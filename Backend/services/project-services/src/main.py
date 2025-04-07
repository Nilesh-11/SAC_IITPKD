from fastapi import FastAPI
from src.routes import projects
from src.database.connection import BaseProjects, engine_project

app = FastAPI(title="Projects Service")

BaseProjects.metadata.create_all(bind=engine_project)

app.include_router(projects.router)

@app.get("/")
def health_check():
    return {"status": "Project Service is running"}

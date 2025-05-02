from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from src.middleware.middleware import LoggingMiddleware
from src.routes import projects
from src.database.connection import BaseProjects, engine_project
from fastapi.exceptions import RequestValidationError

app = FastAPI(title="Projects Service")

BaseProjects.metadata.create_all(bind=engine_project)

app.include_router(projects.router)

app.add_middleware(LoggingMiddleware)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_error = errors[0]
    msg = first_error["msg"]
    return JSONResponse(
        status_code=422,
        content={
            "type": "error",
            "details": f"{msg}"
        }
    )

@app.get("/")
def health_check():
    return JSONResponse(content={"status": "Project Service is running"})

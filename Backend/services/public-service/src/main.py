from src.database.connection import BasePublic, engine_public
from src.middleware.middleware import LoggingMiddleware
from src.routes import public
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

app = FastAPI(title="Public Service")

BasePublic.metadata.create_all(bind=engine_public)

app.add_middleware(LoggingMiddleware)
app.include_router(public.router)

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
    return JSONResponse(
                content= {
                    "status": "Event Service is running"
                }
            )

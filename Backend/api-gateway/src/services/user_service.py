from src.config import USERS_SERVICE_URL
import httpx
from fastapi.responses import JSONResponse

headers = {
    'Content-type': 'application/json',
    'Accept': 'application/json'
}

async def forward_user_request(path:str, data):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{USERS_SERVICE_URL}{path}", json=data, headers=headers)
        if "application/json" in response.headers.get("Content-Type", ""):
            return JSONResponse(content=response.json(), status_code=response.status_code)
        else:
            print("Invalid response format from user service")
            return JSONResponse(
                content={'type': "error", "details": "Invalid response format", "status_code": response.status_code},
                status_code=response.status_code
            )
    except Exception as e:
        print("Failed to connect to user service: ", e)
        return JSONResponse(
            content={'type': "error", 'details': "An error occurred while connecting to user service"},
            status_code=503
        )


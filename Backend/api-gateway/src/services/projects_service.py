from src.config import PROJECTS_SERVICE_URL
import httpx

headers = {
    'Content-type': 'application/json',
    'Accept': 'application/json'
}

async def forward_projects_request(path:str, data):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{PROJECTS_SERVICE_URL}{path}", json=data, headers=headers)
            print(response)
        if "application/json" in response.headers.get("Content-Type", ""):
            return response.json()
        else:
            print("Invalid response format from auth service")
            return {'content': {'type': "error", "details": "An error occurred", "status_code": response.status_code}}
    except Exception as e:
        print("Failed to connect to auth service: ", e)
        return {'content': {'type':"error", 'details': f"An error occured", 'status_code': 503}}


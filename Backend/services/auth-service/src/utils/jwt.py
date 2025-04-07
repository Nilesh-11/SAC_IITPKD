import time
import datetime
import jwt
from src.config.config import session_duration, JWT_PRIVATE_KEY, JWT_PUBLIC_KEY

def create_jwt(id: str, email: str, role: str, aud: str):
    curr_time = int(time.time())
    payload = {
        "iss": "IIT_Palakkad",
        "sub": id,
        "aud": aud,
        "email": email,
        "role": role,
        "exp": curr_time + int(session_duration.total_seconds()),
        "iat": curr_time
    }
    token = jwt.encode(payload, JWT_PRIVATE_KEY, algorithm="RS256")
    return token

def verify_jwt(token):
    data = jwt.decode(token, JWT_PUBLIC_KEY, algorithms=["RS256"], audience=["internal", "public"])
    return data

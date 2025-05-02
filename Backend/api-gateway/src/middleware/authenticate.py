from src.config import JWT_PUBLIC_KEY
import jwt
from jwt import InvalidTokenError, ExpiredSignatureError, DecodeError
from fastapi.responses import JSONResponse

def authenticate_jwt(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, JWT_PUBLIC_KEY, algorithms=["RS256"],  audience=["internal", "public"])
        return {'type': "ok", 'data': payload}
    except ExpiredSignatureError:
        return {'type': "error", 'details': "JWTExpired"}
    except InvalidTokenError:
        return {'type': "error", 'details': "JWTInvalid"}
    except DecodeError:
        return {'type': "error", 'details': "JWTInvalid"}
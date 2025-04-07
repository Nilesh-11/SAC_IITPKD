from src.config import JWT_PUBLIC_KEY
import jwt
from jwt import InvalidTokenError, ExpiredSignatureError, DecodeError

def authenticate_jwt(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, JWT_PUBLIC_KEY, algorithms=["RS256"],  audience=["internal", "public"])
        return {'content': {'type': "ok", 'data': payload}}
    except ExpiredSignatureError:
        print("jwt expired")
        return {'content':{'type': "error", 'details': "JWTExpired"}}
    except InvalidTokenError:
        print("jwt invalid")
        return {'content':{'type': "error", 'details': "JWTInvalid"}}
    except DecodeError:
        print("jwt not decoded")
        return {'content':{'type': "error", 'details': "JWTInvalid"}}
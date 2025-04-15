import os
from dotenv import load_dotenv
import logging

logging.basicConfig(
    filename="logs/api-gateway.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s", 
)
logger = logging.getLogger(__name__)

load_dotenv(".env")

with open("./secrets/private.pem", "r") as f:
    JWT_PRIVATE_KEY = f.read()

with open("./secrets/public.pem", "r") as f:
    JWT_PUBLIC_KEY = f.read()

AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:8001")
EVENTS_SERVICE_URL = os.getenv("EVENTS_SERVICE_URL", "http://localhost:8002")
PROJECTS_SERVICE_URL = os.getenv("PROJECTS_SERVICE_URL", "http://localhost:8003")
USERS_SERVICE_URL = os.getenv("USERS_SERVICE_URL", "http://localhost:8004")
PUBLIC_SERVICE_URL = os.getenv("PUBLIC_SERVICE_URL", "http://localhost:8005")
DEBUG_MODE = os.getenv("DEBUG", True)
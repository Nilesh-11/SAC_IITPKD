import os
from dotenv import load_dotenv
import logging

logging.basicConfig(
    filename="logs/public-service.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s", 
)
logger = logging.getLogger(__name__)

ENVIRONMENT = os.getenv("ENV", "development")
if ENVIRONMENT == "development":
    load_dotenv(".env.dev") 
else:
    load_dotenv(".env")

EVENTS_DATABASE_URL = os.getenv("EVENTS_DATABASE_URL", "sqlite:///dev.db")
USERS_DATABASE_URL = os.getenv("USERS_DATABASE_URL", "sqlite:///dev.db")
PROJECTS_DATABASE_URL = os.getenv("PROJECTS_DATABASE_URL", "sqlite:///dev.db")
PUBLIC_DATABASE_URL = os.getenv("PUBLIC_DATABASE_URL", "sqlite:///dev.db")
MY_MAIL = os.getenv("MY_MAIL", "user1234@gmail.com")
MY_MAIL_PASS = os.getenv("MY_MAIL_PASS", "69")
DEBUG_MODE = os.getenv("DEBUG", True)

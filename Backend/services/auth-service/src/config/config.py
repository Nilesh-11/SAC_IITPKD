import os
from dotenv import load_dotenv
import logging
import datetime

logging.basicConfig(
    filename="logs/auth-service.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s", 
)
logger = logging.getLogger(__name__)

load_dotenv(".env")

with open("./secrets/private.pem", "r") as f:
    JWT_PRIVATE_KEY = f.read()

with open("./secrets/public.pem", "r") as f:
    JWT_PUBLIC_KEY = f.read()

AUTH_DATABASE_URL = os.getenv("AUTH_DATABASE_URL", "sqlite:///dev.db")
USERS_DATABASE_URL = os.getenv("USERS_DATABASE_URL", "sqlite:///dev.db")
PROJECTS_DATABASE_URL = os.getenv("PROJECTS_DATABASE_URL", "sqlite:///dev.db")
EVENTS_DATABASE_URL = os.getenv("EVENTS_DATABASE_URL", "sqlite:///dev.db")
PUBLIC_DATABASE_URL = os.getenv("PUBLIC_DATABASE_URL", "sqlite:///dev.db")
BACKEND_URL = os.getenv("BACKEND_URL", "https://example.com")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://example.com")
MY_MAIL = os.getenv("MY_MAIL", "user1234@gmail.com")
MY_MAIL_PASS = os.getenv("MY_MAIL_PASS", "69")
DEBUG_MODE = os.getenv("DEBUG", True)

password_expiration_time=datetime.timedelta(minutes=15)
otp_expiration_time = datetime.timedelta(minutes=3)
otp_resend_time = datetime.timedelta(minutes=5)
session_duration = datetime.timedelta(hours=6)
otp_attempt_limit = 5
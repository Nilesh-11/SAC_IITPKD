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

ENVIRONMENT = os.getenv("ENV", "development")
if ENVIRONMENT == "development":
    load_dotenv(".env.dev") 
else:
    load_dotenv(".env") 

with open("private.pem", "r") as f:
    JWT_PRIVATE_KEY = f.read()

with open("public.pem", "r") as f:
    JWT_PUBLIC_KEY = f.read()

AUTH_DATABASE_URL = os.getenv("AUTH_DATABASE_URL", "sqlite:///dev.db")
USERS_DATABASE_URL = os.getenv("USERS_DATABASE_URL", "sqlite:///dev.db")
MY_MAIL = os.getenv("MY_MAIL", "user1234@gmail.com")
MY_MAIL_PASS = os.getenv("MY_MAIL_PASS", "69")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", None)
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", None)
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", None)
DEBUG_MODE = os.getenv("DEBUG", True)

otp_expiration_time = datetime.timedelta(minutes=3)
otp_resend_time = datetime.timedelta(minutes=5)
session_duration = datetime.timedelta(hours=6)
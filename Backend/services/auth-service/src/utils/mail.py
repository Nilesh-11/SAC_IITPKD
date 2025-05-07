import smtplib
from email.message import EmailMessage
from src.config.config import MY_MAIL, MY_MAIL_PASS
from pydantic import EmailStr
from src.utils.auth import generate_otp
from src.schemas.mail import html_formatted_otp, html_formatted_password_reset

def send_mail_otp(to_mail: EmailStr):
    otp = generate_otp()
    msg = EmailMessage()
    try:
        html_content = html_formatted_otp(otp, MY_MAIL)
        
        msg.set_content(f"This is a mail to register with SAC, enter the following OTP: {otp}")
        msg.add_alternative(html_content, subtype="html")
        msg["Subject"] = "SAC Registration OTP"
        msg["From"] = MY_MAIL
        msg["To"] = to_mail
        
        with smtplib.SMTP("61.0.251.124", 40000) as server:
            server.starttls()
            server.login(MY_MAIL, MY_MAIL_PASS)
            server.send_message(msg)
        return {"type": "ok", "otp": otp}
    except Exception as e:
        print("Error occurred in sending OTP: ", e)
        return {"type": "error", "details": "Failed to send email."}

def send_password_reset_mail(to_mail: EmailStr, reset_link: str):
    msg = EmailMessage()
    try:
        html_content = html_formatted_password_reset(reset_link, MY_MAIL)
        msg.set_content(f"If you requested to reset your password, click the following link:\n{reset_link}")
        msg.add_alternative(html_content, subtype="html")
        msg["Subject"] = "SAC Password Reset Request"
        msg["From"] = MY_MAIL
        msg["To"] = to_mail
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(MY_MAIL, MY_MAIL_PASS)
            server.send_message(msg)
        return {"type": "ok", "message": "Password reset email sent."}
    except Exception as e:
        print("Error occurred in sending password reset mail: ", e)
        return {"type": "error", "details": "Failed to send email."}
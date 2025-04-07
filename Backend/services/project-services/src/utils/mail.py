import smtplib
from email.message import EmailMessage
from src.config.config import MY_MAIL, MY_MAIL_PASS
from pydantic import EmailStr
from typing import List
from src.schemas.mail import html_meeting_invitation, html_meeting_reminder
from src.models.projects import Meetings

def send_new_meeting_mail(to_mail: EmailStr, meeting: Meetings, project_title: str, contact_email: str):
    msg = EmailMessage()
    try:
        html_content = html_meeting_invitation(meeting, project_title, contact_email)

        msg.set_content(f"You've been invited to a new meeting titled '{meeting.title}' under the project '{project_title}'.")
        msg.add_alternative(html_content, subtype="html")
        msg["Subject"] = f"Meeting Invitation: {meeting.title}"
        msg["From"] = MY_MAIL
        msg["To"] = to_mail

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(MY_MAIL, MY_MAIL_PASS)
            server.send_message(msg)

        return {"type": "ok", "details": f"Invitation sent to {to_mail}"}

    except Exception as e:
        print("Error occurred while sending meeting invite: ", e)
        return {"type": "error", "details": str(e)}

def send_meeting_reminder_mail(to_mail: EmailStr, meeting: Meetings, project_title: str, contact_email: str,  cc: List[EmailStr] = None):
    msg = EmailMessage()
    try:
        print(to_mail)
        html_content = html_meeting_reminder(meeting, project_title, contact_email)

        msg.set_content(f"Reminder: The meeting '{meeting.title}' under '{project_title}' is scheduled soon.")
        msg.add_alternative(html_content, subtype="html")
        msg["Subject"] = f"Reminder: {meeting.title}"
        msg["From"] = MY_MAIL
        msg["To"] = to_mail
        if cc:
            msg["Cc"] = ", ".join(cc)
        recipients = [to_mail] + (cc if cc else [])
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(MY_MAIL, MY_MAIL_PASS)
            server.send_message(msg, to_addrs=recipients)
        return {"type": "ok", "details": f"Reminder sent to {to_mail}"}
    
    except Exception as e:
        print("Error sending meeting reminder:", e)
        return {"type": "error", "details": str(e)}
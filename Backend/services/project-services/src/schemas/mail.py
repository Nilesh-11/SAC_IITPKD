from src.models.projects import Meetings, MeetingType

def html_meeting_invitation(meeting: Meetings, project_title: str, contact_email: str):
    meeting_time = meeting.scheduled_at.strftime("%A, %d %B %Y at %I:%M %p")
    
    if meeting.meeting_type == MeetingType.ONLINE:
        location_info = f'''
            <p class="text">📍 <strong>Online Meeting Link:</strong> <a href="{meeting.meeting_link}">{meeting.meeting_link}</a></p>
        '''
    else:
        location_info = f'''
            <p class="text">📍 <strong>Venue:</strong> {meeting.venue}</p>
        '''

    html = f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Meeting Invitation - SAC</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }}
            .container {{
                width: 100%;
                max-width: 600px;
                margin: 30px auto;
                background: #ffffff;
                padding: 20px;
                text-align: center;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }}
            .logo {{
                width: 120px;
                margin-bottom: 20px;
            }}
            .text {{
                font-size: 16px;
                color: #333;
                margin: 10px 0;
            }}
            .title {{
                font-size: 22px;
                font-weight: bold;
                color: #007BFF;
                margin-bottom: 10px;
            }}
            .footer {{
                font-size: 12px;
                color: #888;
                margin-top: 30px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <img src="https://iitpkd.ac.in/sites/default/files/IITWEBLOGO%20%283%29.jpg" alt="IIT Palakkad Logo" class="logo">
            <div class="title">📅 You're Invited to a Meeting</div>
            <p class="text"><strong>Project:</strong> {project_title}</p>
            <p class="text"><strong>Meeting Title:</strong> {meeting.title}</p>
            <p class="text"><strong>Description:</strong> {meeting.description}</p>
            <p class="text">🕒 <strong>Scheduled At:</strong> {meeting_time}</p>
            <p class="text"><strong>Meeting Type:</strong> {meeting.meeting_type.value.capitalize()}</p>
            {location_info}
            <p class="text">Please be on time and prepared. Looking forward to your participation!</p>
            <p class="footer">Need help or have questions? Contact us at <a href="mailto:{contact_email}">{contact_email}</a></p>
        </div>
    </body>
    </html>
    '''
    return html

def html_meeting_reminder(meeting: Meetings, project_title: str, contact_email: str):
    meeting_time = meeting.scheduled_at.strftime("%A, %d %B %Y at %I:%M %p")
    
    if meeting.meeting_type == "online":
        location_info = f'''
            <p class="text">📍 <strong>Online Meeting Link:</strong> <a href="{meeting.meeting_link}">{meeting.meeting_link}</a></p>
        '''
    else:
        location_info = f'''
            <p class="text">📍 <strong>Venue:</strong> {meeting.venue}</p>
        '''

    html = f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Meeting Reminder - SAC</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }}
            .container {{
                width: 100%;
                max-width: 600px;
                margin: 30px auto;
                background: #ffffff;
                padding: 20px;
                text-align: center;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }}
            .logo {{
                width: 120px;
                margin-bottom: 20px;
            }}
            .text {{
                font-size: 16px;
                color: #333;
                margin: 10px 0;
            }}
            .title {{
                font-size: 22px;
                font-weight: bold;
                color: #007BFF;
                margin-bottom: 10px;
            }}
            .footer {{
                font-size: 12px;
                color: #888;
                margin-top: 30px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <img src="https://iitpkd.ac.in/sites/default/files/IITWEBLOGO%20%283%29.jpg" alt="IIT Palakkad Logo" class="logo">
            <div class="title">⏰ Reminder: Upcoming Meeting</div>
            <p class="text"><strong>Project:</strong> {project_title}</p>
            <p class="text"><strong>Meeting:</strong> {meeting.title}</p>
            <p class="text"><strong>Description:</strong> {meeting.description}</p>
            <p class="text">🕒 <strong>Scheduled At:</strong> {meeting_time}</p>
            {location_info}
            <p class="text">This is a gentle reminder. Please be on time!</p>
            <p class="footer">Questions? Contact <a href="mailto:{contact_email}">{contact_email}</a></p>
        </div>
    </body>
    </html>
    '''
    return html

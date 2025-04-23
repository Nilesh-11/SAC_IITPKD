from src.config.config import otp_expiration_time

def html_formatted_otp(otp, my_mail):
    response = f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>OTP Verification - Hallway Software</title>
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
                width: 150px;
                margin-bottom: 20px;
            }}
            .otp-box {{
                font-size: 22px;
                font-weight: bold;
                color: #333;
                background: #f8f8f8;
                padding: 15px;
                display: inline-block;
                border-radius: 5px;
                letter-spacing: 4px;
            }}
            .text {{
                font-size: 16px;
                color: #555;
                margin-bottom: 20px;
            }}
            .footer {{
                font-size: 12px;
                color: #888;
                margin-top: 20px;
            }}
            .button {{
                background: #007BFF;
                color: white;
                padding: 12px 25px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                display: inline-block;
                margin-top: 15px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <img src="https://iitpkd.ac.in/sites/default/files/IITWEBLOGO%20%283%29.jpg" alt="IIT Palakkad Logo" class="logo">  
            <h2>🔐 Your OTP Code to login to SAC</h2>
            <p class="text">Use the OTP below to complete your authentication. It expires in {otp_expiration_time} minutes.</p>
            <div class="otp-box">{otp}</div>
            <p class="text">If you did not request this OTP, please ignore this email.</p>
            <p class="footer">Need help? Contact us at <a href="mailto:{my_mail}">{my_mail}</a></p>
        </div>
    </body>
    </html>
    '''
    return response
def html_formatted_password_reset(reset_link, my_mail):
    # Extract token from the reset_link (assuming token is in the query param)
    import urllib.parse
    parsed_url = urllib.parse.urlparse(reset_link)
    token = urllib.parse.parse_qs(parsed_url.query).get("token", [""])[0]

    html_content = f'''
        <!DOCTYPE html>
        <html>
        <head>
            <title>Password Reset - SAC</title>
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
                    width: 150px;
                    margin-bottom: 20px;
                }}
                .text {{
                    font-size: 16px;
                    color: #555;
                    margin-bottom: 20px;
                }}
                .footer {{
                    font-size: 12px;
                    color: #888;
                    margin-top: 20px;
                }}
                .button {{
                    background: #007BFF;
                    color: white;
                    padding: 12px 25px;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                    display: inline-block;
                    margin-top: 15px;
                }}
                .token-box {{
                    background-color: #f1f1f1;
                    padding: 10px;
                    border-radius: 5px;
                    font-family: monospace;
                    color: #333;
                    margin-top: 10px;
                    word-break: break-all;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://iitpkd.ac.in/sites/default/files/IITWEBLOGO%20%283%29.jpg" alt="IIT Palakkad Logo" class="logo">  
                <h2>🔐 Reset Your SAC Password</h2>
                <p class="text">We received a request to reset your SAC password. Click the button below to continue:</p>
                <a href="{reset_link}" class="button">Reset Password</a>
                <p class="text">Or use the token directly (if needed):</p>
                <div class="token-box">{token}</div>
                <p class="text">This link will expire in 15 minutes. If you didn’t request a password reset, please ignore this email.</p>
                <p class="footer">Need help? Contact us at <a href="mailto:{my_mail}">{my_mail}</a></p>
            </div>
        </body>
        </html>
    '''
    return html_content

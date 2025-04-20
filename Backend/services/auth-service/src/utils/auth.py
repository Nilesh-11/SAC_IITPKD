import string
import hashlib
import random

def hash_password(password: str):
    hash_object = hashlib.sha256(password.encode())  
    hash_hex = hash_object.hexdigest()
    return hash_hex

def generate_otp():
    return str(random.randint(100000, 999999))

def generate_strong_password(length=12):
    if length < 4:
        raise ValueError("Password length must be at least 4 to meet all character requirements.")
    digits = random.choice(string.digits)
    lowercase = random.choice(string.ascii_lowercase)
    uppercase = random.choice(string.ascii_uppercase)
    special = random.choice("!@#$%^&*()-_=+[]{}|;:,.<>?/~`")
    all_chars = string.ascii_letters + string.digits + "!@#$%^&*()-_=+[]{}|;:,.<>?/~`"
    rest = ''.join(random.choices(all_chars, k=length - 4))
    password = list(digits + lowercase + uppercase + special + rest)
    random.shuffle(password)
    return ''.join(password)

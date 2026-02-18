from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
import bcrypt

SECRET_KEY = "supersecret"
ALGORITHM = "HS256"

from fastapi.middleware.cors import CORSMiddleware

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 🔥 helper function
def _truncate_password(password: str) -> str:
    return password.encode("utf-8")[:72].decode("utf-8", "ignore")


def hash_password(password: str):
    password = password.encode("utf-8")[:72]
    return bcrypt.hashpw(password, bcrypt.gensalt()).decode("utf-8")

def verify_password(password: str, hashed: str):
    password = password.encode("utf-8")[:72]
    return bcrypt.checkpw(password, hashed.encode("utf-8"))

def create_token(data: dict):
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(hours=2)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

# Authentication utilities for the FastAPI application
# 
# Including password hashing
# And JWT token management

from jose import JWTError, jwt
import pytz
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from api.database import users_collection, logs_collection

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
# Ensure SECRET_KEY is defined
if not SECRET_KEY:
    raise ValueError("SECRET_KEY no está definida en el archivo .env")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# Password hashing and verification
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


# Token management
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes = ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    return jwt.encode(to_encode, SECRET_KEY, algorithm = ALGORITHM)

def decode_token(token: str) -> dict:
    return jwt.decode(token, SECRET_KEY, algorithms = [ALGORITHM])


# Dependency to get current user from token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "/users/login")
async def get_current_user(token: str = Depends(oauth2_scheme)):
    
    credentials_exception = HTTPException(
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail = "Token inválido o expirado",
        headers = {"WWW-Authenticate": "Bearer"}
    )
    
    try:
        payload = decode_token(token)
        username: str = payload.get("sub")
        
        if username is None:
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
    
    user = await users_collection.find_one({"username": username})
    
    if user is None:
        raise credentials_exception
    
    return user



# Logs
async def log_action(username: str, action: str, ip: str = "", details: str = ""):
    
    mexico_tz = pytz.timezone("America/Mexico_City")
    local_time = datetime.now(mexico_tz)
    
    log = {
        "username": username,
        "action": action,
        "timestamp": local_time.strftime("%Y-%m-%d %H:%M:%S"),
    }
    await logs_collection.insert_one(log)

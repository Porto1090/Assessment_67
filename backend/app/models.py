# Model of how users are represented in the database

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserInDB(BaseModel):
    username: str
    email: EmailStr
    hashed_password: str
    is_active: bool = True
    is_verified: bool = False

class SessionLog(BaseModel):
    username: str
    action: str
    timestamp: datetime

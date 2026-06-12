from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime

# Model of how users are represented in the database
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

# Models for request and response data using Pydantic
class UserCreate(BaseModel):
	username: str
	email: EmailStr
	password: str

	@field_validator("password")
	@classmethod
	
	def password_length(cls, v):
		if len(v.encode("utf-8")) > 72:
			raise ValueError("La contraseña no puede superar 72 bytes")
		if len(v) < 8:
			raise ValueError("La contraseña debe tener al menos 8 caracteres")
		return v

class UserResponse(BaseModel):
	username: str
	email: EmailStr
	is_active: bool

class Token(BaseModel):
	access_token: str
	token_type: str

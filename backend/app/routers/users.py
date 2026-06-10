# User router to register and login users
#
# Using fastapi, motor, and JWT for authentication

from fastapi import APIRouter, HTTPException, status, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas import UserCreate, UserResponse, Token
from app.models import UserInDB
from app.database import users_collection, logs_collection
from app.auth import hash_password, verify_password, create_access_token, get_current_user, log_action

router = APIRouter(prefix = "/users", tags = ["users"])



# === Endpoint 1: Register ===
@router.post("/register", response_model = UserResponse, status_code = status.HTTP_201_CREATED)
async def register(user: UserCreate):
    
    existing = await users_collection.find_one({"email": user.email})

    if existing:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = "El email ya está registrado"
        )
    
    user_in_db = UserInDB(
        username = user.username,
        email = user.email,
        hashed_password = hash_password(user.password)
    )
    
    await users_collection.insert_one(user_in_db.model_dump())

    return user_in_db



# === Endpoint 2: Login ===
@router.post("/login", response_model = Token)
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    
    user = await users_collection.find_one({"username": form_data.username})
    
    if not user:
        user = await users_collection.find_one({"email": form_data.username})

    if not user:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = "Credenciales inválidas"
        )
    
    if not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = "Credenciales inválidas"
        )
    
    access_token = create_access_token(data = {"sub": user["username"]})
    
    # Log the login action
    await log_action(
        username = user["username"],
        action = "login",
        ip = request.client.host
    )

    return Token(access_token = access_token, token_type = "bearer")



# === Endpoint 3: Get current profile (In order to protect the route) ===
@router.get("/me", response_model = UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return current_user



# === Endpoint 4: Get the last 50 logs of the current user ===
@router.get("/me/logs")
async def get_my_logs(current_user: dict = Depends(get_current_user)):
    
    cursor = logs_collection.find(
        {"username": current_user["username"]},
        {"_id": 0}  # Excluding the _id from MongoDB's response
    ).sort("timestamp", -1) # Most recent first
    
    logs = await cursor.to_list(length = 50) # Max 50 logs
    return logs

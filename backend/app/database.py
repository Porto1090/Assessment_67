# MongoDB connection setup
#
# Using Motor (async MongoDB driver)
# and dotenv for environment variables

from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL")

client = AsyncIOMotorClient(MONGO_URL)
db = client["ass67_auth_db"]

users_collection = db["users"]
logs_collection = db["logs"]

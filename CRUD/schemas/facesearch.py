from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
from .user import User


class FaceSearch(BaseModel):
    face: str = None


class Face(FaceSearch):
    score: float = None
    full_name: str = None
    user_info: User = None
    searched_at: datetime=datetime.now()


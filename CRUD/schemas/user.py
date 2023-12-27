#schemas
from pydantic import BaseModel, validator, EmailStr, Field
from typing import Optional
from datetime import datetime, date
from uuid import uuid4
# from bson.objectid import ObjectId


class UserBase(BaseModel):
    full_name: str
    birthday: datetime
    gender: str
    phone_number: str
    address: str
    email: EmailStr
    introduction: str = None
    image: Optional[str]
    id_milvus: Optional[int] = None
    img_vector: Optional[list] = None

class UserCreate(UserBase):
    full_name: str
    birthday: datetime
    gender: str
    phone_number: str
    address: str
    email: EmailStr
    introduction: str = None
    # image: Optional[str]
    # id_milvus: Optional[int] = None


class UserUpdate(UserBase):
    full_name: str
    birthday: datetime
    gender: str
    phone_number: str
    address: str
    email: EmailStr
    introduction: str = None
    created_at: datetime
    updated_at: datetime


class User(UserBase):
    id: str = Field(..., alias='_id')
    created_at: datetime=datetime.now()
    updated_at: datetime=datetime.now()
    @validator("gender")
    def validate_gender(cls, v):
        if v.lower() not in ["male", "female"]:
            raise ValueError("Invalid gender, must be 'male' or 'female'")
        return v.lower()

    def __init__(self, **kwargs):
        if '_id' in kwargs:
            kwargs['_id'] = str(kwargs['_id'])

        super().__init__(**kwargs)

        now = datetime.now()
        if 'created_at' not in kwargs:
            kwargs['created_at'] = now

        kwargs['updated_at'] = now
    class Config:
        from_attributes = True

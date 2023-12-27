#schemas
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
# from bson.objectid import ObjectId


class AdminUserBase(BaseModel):
    full_name: str
    email: EmailStr
    introduction: str = ""
    password: str = None

class AdminUserCreate(AdminUserBase):
    full_name: str
    email: EmailStr
    introduction: str = ""
    password: str = None


class AdminUserUpdate(AdminUserBase):
    full_name: str
    email: EmailStr
    introduction: str = ""
    password: str = None


class AdminUser(AdminUserBase):
    id: str = Field(..., alias='_id')
    created_at: datetime=datetime.now()
    updated_at: datetime=datetime.now()

    def __init__(self, **kwargs):
        if '_id' in kwargs:
            kwargs['_id'] = str(kwargs['_id'])
        if kwargs['introduction'] is None:
            kwargs['introduction'] = ''
        del kwargs['password']
        super().__init__(**kwargs)

        now = datetime.now()
        if 'created_at' not in kwargs:
            kwargs['created_at'] = now

        kwargs['updated_at'] = now
    class Config:
        from_attributes = True

class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str

class AdminLoginResponse(BaseModel):
    access_token: str
    info: AdminUser
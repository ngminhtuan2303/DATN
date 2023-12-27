from datetime import datetime
from re import L
from fastapi import APIRouter
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from schemas.setting import TimeSetting
from schemas.user import User, UserCreate, UserUpdate
from services.setting import TimeSettingService
from services.user import UserService
from schemas.facesearch import Face, FaceSearch
from services.admin import AdminUserService
from schemas.admin import AdminLoginRequest, AdminLoginResponse, AdminUser, AdminUserCreate, AdminUserUpdate
from typing import List
from starlette.requests import Request
router = APIRouter()


def authen_admin(request: Request ):
    hashed_token = ""
    if 'authorization' in request.headers.keys():
        hashed_token = request.headers["authorization"].split(" ")[-1]
    if not hashed_token:
        raise HTTPException(401, "unauthorize")
    AdminUserService.authorize(hashed_token)

@router.post("/api/v1/user", response_model=UserCreate)
def create_user(user: UserCreate):
    return UserService.create_user(user)

@router.get("/api/v1/user", response_model=List[User])
def list_users(full_name: str = None, gender: str = None):
    return UserService.list_users(full_name, gender)

@router.get("/api/v1/user/{user_id}", response_model=User)
def get_user(user_id: str):
    return UserService.get_user(user_id)

@router.put("/api/v1/user/{user_id}", response_model=UserUpdate)
def update_user(user_id: str, user_update: User):
    return UserService.update_user(user_id, user_update)

@router.delete("/api/v1/user/{user_id}")
def delete_user(user_id: str):
    return UserService.delete_user(user_id)

@router.post("/api/v1/facesearch", response_model=Face)
def search_face(face: FaceSearch):
    return UserService.search_face(face)


@router.get("/api/v1/searchuser", response_model=List[Face])
def list_query_users(full_name: str = None, date: datetime = datetime.now()):
    return UserService.list_query_users(full_name, date)

@router.get("/api/v1/export")
def export_csv_search_users_fullname(date: datetime = datetime.now()):
    return UserService.export_csv_search_users_fullname(date)





@router.post("/api/v1/admin", response_model=AdminUser)
def create_user(user: AdminUserCreate):
    return AdminUserService.create_user(user)

@router.get("/api/v1/admin", response_model=List[AdminUser])
def list_users(full_name: str = None, gender: str = None):
    return AdminUserService.list_users(full_name, gender)

@router.get("/api/v1/admin/{user_id}", response_model=AdminUser)
def get_user(user_id: str):
    return AdminUserService.get_user(user_id)

@router.put("/api/v1/admin/{user_id}", response_model=AdminUserUpdate)
def update_user(user_id: str, user_update: AdminUser):
    return AdminUserService.update_user(user_id, user_update)

@router.delete("/api/v1/admin/{user_id}")
def delete_user(user_id: str):
    return AdminUserService.delete_user(user_id)

@router.post("/api/v1/login", response_model=AdminLoginResponse)
def login(login_request: AdminLoginRequest):
    res = AdminUserService.login(login_request)
    return res

@router.get("/api/v1/setting", response_model=TimeSetting)
def get_setting():
    res = TimeSettingService.get_setting()
    return res

@router.post("/api/v1/setting", response_model=TimeSetting)
def get_setting(timeseting: TimeSetting):
    res = TimeSettingService.save_setting(timeseting)
    return res
# services
from email.mime import image
from hashlib import algorithms_available
from typing import List, Union
from schemas.admin import AdminLoginRequest, AdminLoginResponse, AdminUser, AdminUserCreate, AdminUserUpdate
from datetime import datetime, timedelta
from fastapi import HTTPException
from data.admin import admin_collection
from pymongo.errors import DuplicateKeyError
from bson.objectid import ObjectId
import bcrypt
import jwt
class AdminUserService:

    def create_user(user: AdminUserCreate) -> Union[AdminUserCreate, None]:
        user_dict = user.dict()
        user_dict["_id"] = ObjectId()
        user_dict["created_at"] = datetime.utcnow()
        user_dict["updated_at"] = datetime.utcnow()
        # Kiểm tra email đã tồn tại hay chưa
        existing_user = admin_collection.find_one({"email": user.email})
        if existing_user:
            return None

        try:
            bytes = user.password.encode('utf-8') 
            # generating the salt 
            salt = bcrypt.gensalt() 
            # Hashing the password 
            user_dict["password"] = bcrypt.hashpw(bytes, salt).decode('utf-8') 
            # Haspassword: Tim hieu hash password & jwt 
            # Login -> email + pass: hash pass nhap vao so sanh voi hash pass in db -> generate token encode user info + expr
            # Call API -> gui kem theo token
            # Token jwt verify -> user info -> db user -> admin -> Pass No: 403 Forbiden
            admin_collection.insert_one(user_dict)
            
        except DuplicateKeyError:
            return None
        return AdminUser(**user_dict)



    def list_users(full_name: str = None, gender: str = None) -> List[AdminUser]:
        query = {}
        if full_name:
            query["full_name"] = {"$regex": full_name, "$options": "i"}
        if gender:
            query["gender"] = gender
        users = [AdminUser(**user) for user in admin_collection.find(query)]
        return users

    
    def get_user(user_id: str) -> AdminUser:
        _id = ObjectId(user_id)
        print(_id)
        user = admin_collection.find_one({"_id": _id})
        if not user:
            raise HTTPException(status_code=404, detail="Admin user not found")
        return AdminUser(**user)
        
    

    

    def update_user(user_id: str, user_update: AdminUser) -> Union[AdminUserUpdate, None]:
        user_dict = user_update.dict()
        user_dict["updated_at"] = datetime.utcnow()

        # Kiểm tra email đã tồn tại và khác với email của user cần cập nhật hay chưa
        existing_user = admin_collection.find_one({"email": user_update.email})
        if existing_user and existing_user["_id"] != ObjectId(user_id):
            return None

        result = admin_collection.update_one({"_id": ObjectId(user_id)}, {"$set": user_dict})

        if result.modified_count:
            user_dict["_id"] = user_id
            return AdminUser(**user_dict)
        raise HTTPException(status_code=404, detail="Admin user not found")

    
    def delete_user(user_id: str):
        user = admin_collection.find_one({"_id": ObjectId(user_id)})
        if user is None:
            raise HTTPException(status_code=404, detail="Admin user not found")
        result = admin_collection.delete_one({"_id": ObjectId(user_id)})
        if not result.deleted_count:
            raise HTTPException(status_code=404, detail="Admin user not delete")
        return {"message": "Admin user deleted"}
    
    def login(login_request: AdminLoginRequest):
        existing_user = admin_collection.find_one({"email": login_request.email})
        if existing_user is None:
            raise HTTPException(404, "admin not found")

        valid = bcrypt.checkpw(login_request.password.encode('utf-8') , existing_user["password"].encode('utf-8'))
        if not valid:
            raise HTTPException(401, "unauthorize")
        # Gen token
        payload = {
            "id": str(existing_user["_id"]),
            "email": login_request.email,
            "exp": (datetime.now() + timedelta(days=1)).timestamp()
        }
        token = jwt.encode(
            payload,
            'key',
            algorithm="HS256"
        )
        return AdminLoginResponse(access_token=token, info=existing_user)
    
    def authorize(token: str):
        try:
            decode = jwt.decode(token, "key", algorithm="HS256", options={"verify_signature": False})
        except:
            raise HTTPException(401, "unauthorize")
        print(decode)
        email = decode["email"]
        existing_user = admin_collection.find_one({"email": email})
        if existing_user is None:
            raise HTTPException(401, 'unauthorize')
        exp = decode["exp"]
        
        

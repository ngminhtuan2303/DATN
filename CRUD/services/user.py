# services
from email.mime import image
import math
from typing import List, Union
from schemas.user import User, UserCreate, UserUpdate
from datetime import datetime
from fastapi import HTTPException
from data.user import collection
from data import time_setting_db
from data.search import facesearch_collection
from pymongo.errors import DuplicateKeyError
from bson.objectid import ObjectId
from milvus_collection.user import milvus_collection, insert_data, search_faces, delete_data
from arcface.ArcFace import ArcFace
import cv2
import numpy as np
from retinaface import RetinaFace
import base64
from schemas.facesearch import FaceSearch, Face
from PIL import Image
import io
import pandas
from fastapi.responses import FileResponse
import os
import pytz

class UserService:

    def create_user(user: UserCreate) -> Union[UserCreate, None]:
        user_dict = user.dict()
        user_dict["_id"] = ObjectId()
        user_dict["created_at"] = datetime.utcnow()
        user_dict["updated_at"] = datetime.utcnow()
        # Kiểm tra email đã tồn tại hay chưa
        existing_user = collection.find_one({"email": user.email})
        if existing_user:
            return None

        try:
            timestamp = user_dict["created_at"].timestamp()
            int64_value = np.int64(timestamp)
            int_value = int(int64_value)


            img_base64 = user_dict["image"]
            # Giải mã chuỗi base64 thành dữ liệu bytes
            img_data = base64.b64decode(img_base64[23:])
            image = Image.open(io.BytesIO(img_data))
            image_np = np.array(image)
            img = cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB)
            # print("anh base64",img_base64)
            
            # Giải mã chuỗi base64 thành dữ liệu bytes
            face_ret = RetinaFace()
            res = face_ret.predict(img)
            if len(res) == 0:
                raise HTTPException(400, "Face not found")
            if len(res) > 1:
                raise HTTPException(400, "Only accept 1 face")
            x1 = res[0]["x1"]
            y1 = res[0]["y1"]
            x2 = res[0]["x2"]
            y2 = res[0]["y2"]
            crop_img = img[y1:y2, x1:x2, :]
            # print("anh bytes", img_data)
            # Chuyển dữ liệu bytes thành mảng numpy
            
            face_rec = ArcFace()
            
            face_embedding = face_rec.calc_emb(crop_img)
            # print("data",face_embedding.dtype)
            img_vector = np.array(face_embedding)
            user_dict["img_vector"] = img_vector.tolist()
            insert_data(milvus_collection, int64_value, img_vector.tolist())
            user_dict["id_milvus"] = int_value
            collection.insert_one(user_dict)
            
        except DuplicateKeyError:
            return None
        return UserCreate(**user_dict)



    def list_users(full_name: str = None, gender: str = None) -> List[User]:
        query = {}
        if full_name:
            query["full_name"] = {"$regex": full_name, "$options": "i"}
        if gender:
            query["gender"] = gender
        users = [User(**user) for user in collection.find(query)]
        return users

    
    def get_user(user_id: str) -> User:
        _id = ObjectId(user_id)
        user = collection.find_one({"_id": _id})
        if user:
            return User(**user)
        raise HTTPException(status_code=404, detail="User not found")
    

    

    def update_user(user_id: str, user_update: User) -> Union[UserUpdate, None]:
        user_dict = user_update.dict()
        user_dict["updated_at"] = datetime.utcnow()

        # Kiểm tra email đã tồn tại và khác với email của user cần cập nhật hay chưa
        existing_user = collection.find_one({"email": user_update.email})
        if existing_user and existing_user["_id"] != ObjectId(user_id):
            return None

        id_milvus_in_mongo = existing_user["id_milvus"]
        
        try:
            # timestamp = user_dict["created_at"].timestamp()
            # int64_value = np.int64(timestamp)
            # int_value = int(int64_value)
            img_base64 = user_dict["image"]
            # print("anh base64",img_base64)
            
            img_data = base64.b64decode(img_base64[23:])
            image = Image.open(io.BytesIO(img_data))
            image_np = np.array(image)
            img = cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB)
            # print("anh base64",img_base64)
            
            # Giải mã chuỗi base64 thành dữ liệu bytes
            face_ret = RetinaFace()
            res = face_ret.predict(img)
            if len(res) == 0:
                raise HTTPException(400, "Face not found")
            if len(res) > 1:
                raise HTTPException(400, "Only accept 1 face")
            x1 = res[0]["x1"]
            y1 = res[0]["y1"]
            x2 = res[0]["x2"]
            y2 = res[0]["y2"]
            crop_img = img[y1:y2, x1:x2, :]
            # print("anh bytes", img_data)
            # Chuyển dữ liệu bytes thành mảng numpy
            
            face_rec = ArcFace()
            
            face_embedding = face_rec.calc_emb(crop_img)
            # print("data",face_embedding.dtype)
            img_vector = np.array(face_embedding)
            user_dict["img_vector"] = img_vector.tolist()
            delete_data(milvus_collection, id_milvus_in_mongo)
            insert_data(milvus_collection, id_milvus_in_mongo, img_vector.tolist())
            user_dict["id_milvus"] = id_milvus_in_mongo
            
        except DuplicateKeyError:
            return None
        result = collection.update_one({"_id": ObjectId(user_id)}, {"$set": user_dict})

        if result.modified_count:
            user_dict["_id"] = user_id
            return User(**user_dict)
        raise HTTPException(status_code=404, detail="User not found")

    
    def delete_user(user_id: str):
        user = collection.find_one({"_id": ObjectId(user_id)})
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        result = collection.delete_one({"_id": ObjectId(user_id)})
        delete_data(milvus_collection, user['id_milvus'])
        if not result.deleted_count:
            raise HTTPException(status_code=404, detail="User not delete")
        return {"message": "User deleted"}
        
    
    def search_face(face: FaceSearch)->Union[FaceSearch,None]:
        face_dict = face.dict()
        face_dict["_faceid"] = ObjectId()
        face_dict["searched_at"] = datetime.utcnow()

        img_base64 = face_dict["face"]
        # print("anh base64",img_base64)
        
        # Giải mã chuỗi base64 thành dữ liệu bytes
        img_data = base64.b64decode(img_base64[23:])
        image = Image.open(io.BytesIO(img_data))
        image_np = np.array(image)
        img = cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB)
        # print("anh numpy",nparr)
        face_ret = RetinaFace()
        res = face_ret.predict(img)
        if len(res) == 0:
            raise HTTPException(400, "Face not found")
        if len(res) > 1:
            raise HTTPException(400, "Only accept 1 face")
        x1 = res[0]["x1"]
        y1 = res[0]["y1"]
        x2 = res[0]["x2"]
        y2 = res[0]["y2"]
        crop_img = img[y1:y2, x1:x2, :]
        face_rec = ArcFace()
        face_embedding = face_rec.calc_emb(crop_img)
        input_face_vct = face_embedding.astype(np.float32).tolist()
        face_res = search_faces(milvus_collection, input_face_vct)
        if face_res is None:
            raise HTTPException(400, {"detail": "Search error"}) 
        milvus_id = face_res.id
        user = collection.find_one({"id_milvus": milvus_id})
        
        from numpy import dot
        from numpy.linalg import norm
        a = np.array(user["img_vector"])
        b = face_embedding.astype(np.float32)
        cos_sim = dot(a, b)/(norm(a)*norm(b))
        if cos_sim > 0.70:
            face_dict["user_info"] = user
            face_dict["score"] = cos_sim
            face_dict["full_name"] = user["full_name"]
            facesearch_collection.insert_one(face_dict)
            return face_dict
        raise HTTPException(404, 'Not registered')



    def list_query_users(full_name: str = None, date: datetime = datetime.now()) -> List[Face]:
        from_time = datetime(date.year, date.month, date.day, 0, 0, 0)
        end_time = datetime(date.year, date.month, date.day, 23, 59, 59)
        query = {"searched_at": {"$gt": from_time, "$lte": end_time}}
        if full_name:
            query["full_name"] = {"$regex": full_name, "$options": "i"}
       
        users = [Face(**user) for user in facesearch_collection.find(query).sort({"searched_at": -1})]
        return users
    

    def export_csv_search_users_fullname(date: datetime = datetime.now()) -> List[Face]:
        from_time = datetime(date.year, date.month, date.day, 0, 0, 0)
        end_time = datetime(date.year, date.month, date.day, 23, 59, 59)
        users = [Face(**user) for user in facesearch_collection.find({"searched_at": {"$gt": from_time, "$lte": end_time}}).sort({"full_name": 1, "searched_at": 1})]

        if users is None:
            raise HTTPException(status_code=404, detail="User not found")
        data = []
        tmp = ""
        time_setting_res = time_setting_db.find_one({"id": 1})
        for user in users:
            if user.full_name != tmp:
                is_late = False
                tmp = user.full_name
                searched_at = user.searched_at.replace(tzinfo=pytz.utc).astimezone(pytz.timezone("Asia/Ho_Chi_Minh"))
                if searched_at.hour > time_setting_res["hour"]:
                    is_late = True
                elif searched_at.hour < time_setting_res["hour"]:
                    is_late = False
                elif searched_at.minute > time_setting_res["minute"]:
                    is_late = True
                else:
                    is_late = False

                data.append([ user.user_info.email, user.full_name, round(user.score, 3), user.searched_at.replace(tzinfo=pytz.utc).astimezone(pytz.timezone("Asia/Ho_Chi_Minh")).strftime("%d/%m/%Y %H:%M"), is_late])
            else:
                data.append([ user.user_info.email, user.full_name, round(user.score, 3), user.searched_at.replace(tzinfo=pytz.utc).astimezone(pytz.timezone("Asia/Ho_Chi_Minh")).strftime("%d/%m/%Y %H:%M")] )
            
        
        df = pandas.DataFrame(data, columns=["Email", "Full name", "Score", "Time", "Late"])

        # Tạo đường dẫn đầy đủ cho tệp CSV
        export_dir = "exports"
        str_timer = date.strftime("%Y%m%d")
        os.makedirs(export_dir, exist_ok=True)  # Tạo thư mục nếu chưa tồn tại
        csv_filename = os.path.join(export_dir, f"export_{str_timer}.csv")
        df.to_csv(csv_filename,",", index=False)

        return FileResponse(csv_filename, filename=f"export_{str_timer}.csv")

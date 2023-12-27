#### Tạo 1 bộ API CRUD về user

Thông tin người dùng:
ID: auto gen (dùng uuidv4)
Họ tên
Ngày sinh
Giới tính
Số đt
Địa chỉ
Email (unique)
Giới thiệu
Image
created_at
updated_at

#### API: 
Tạo 1 user (POST /api/v1/user)
Get list (GET /api/v1/user) Query theo họ tên, giới tính
Get detail 1 user bằng ID (GET /api/v1/user/:id)
Update tất cả thông tin của 1 user (PUT /api/v1/user/:id)
Xóa 1 user (DEL /api/v1/user/:id)

#### Yêu cầu: 
Tạo model cho request body và response bằng pydantic
Khi POST 1 user thì extract Image thành vector lưu vào milvus ta được id_milvus của ảnh -> lưu vào mongodb id_milvus và vector của ảnh
Chia các tầng 
milvus - kết nối với milvus
schemas - Lưu các model pydantic
model - kết nối với mongoDB sử dụng pymongo
services - Xử lý các tác vụ mà nhận được từ api và trả kết quả
api - tạo các API bằng fastapi với apirouter


# from fastapi import FastAPI, HTTPException
# from fastapi.param_functions import Query
# from uuid import uuid4
# from datetime import datetime
# from typing import List
# from pydantic import BaseModel, validator, EmailStr

# class User(BaseModel):
#     id: str
#     full_name: str
#     birthday: datetime
#     gender: str
#     phone_number: str
#     address: str
#     email: EmailStr
#     introduction: str = None
#     created_at: datetime = datetime.now()
#     updated_at: datetime = datetime.now()

#     @validator("gender")
#     def validate_gender(cls, v):
#         if v.lower() not in ["male", "female"]:
#             raise ValueError("Invalid gender, must be 'male' or 'female'")
#         return v.lower()

#     def __init__(self, **kwargs):
#         if 'id' not in kwargs:
#             kwargs['id'] = str(uuid4())
#         super().__init__(**kwargs)

# # class UserOut(BaseModel):
# #     id: str
# #     full_name: str
# #     birthday: datetime
# #     gender: str
# #     phone_number: str
# #     address: str
# #     email: EmailStr
# #     introduction: str = None
# #     created_at: datetime
# #     updated_at: datetime


# # class UserUpdate(BaseModel):
# #     full_name: str
# #     birthday: datetime
# #     gender: str
# #     phone_number: str
# #     address: str
# #     email: EmailStr
# #     introduction: str = None


# # Global variable
# users = [
#     User(
#         full_name="Nguyễn Văn A",
#         birthday=datetime.strptime("1990-01-01", "%Y-%m-%d"),
#         gender="Male",
#         phone_number="0123456789",
#         address="Hà Nội",
#         email="nguyenvana@gmail.com",
#     ),
#     User(
#         full_name="Lê Thị B",
#         birthday=datetime.strptime("1995-02-01", "%Y-%m-%d"),
#         gender="Female",
#         phone_number="0987654321",
#         address="Sài Gòn",
#         email="lethib@gmail.com",
#         introduction="I'm a software engineer",
#     ),
# ]

# app = FastAPI()

# @app.post("/api/v1/user", response_model=User)
# def create_user(user: User):
#     for u in users:
#         if u.email == user.email:
#             raise HTTPException(status_code=400, detail="Email already exists")
#     users.append(user)
#     return user

# @app.get("/api/v1/user", response_model=List[User])
# def list_users(full_name: str = None, gender: str = None):
#     if full_name and gender:
#         return [
#             user for user in users
#             if user.full_name.lower().startswith(full_name.lower()) and user.gender == gender.lower()
#         ]
#     elif full_name:
#         return [user for user in users if user.full_name.lower().startswith(full_name.lower())]
#     elif gender:
#         return [user for user in users if user.gender == gender.lower()]
#     return users

# @app.get("/api/v1/user/{user_id}", response_model=User)
# def get_user(user_id: str):
#     for user in users:
#         if user.id == user_id:
#             return user
#     raise HTTPException(status_code=404, detail="User not found")

# @app.put("/api/v1/user/{user_id}", response_model=User)
# def update_user(user_id: str, user_update: User):
#     for i, user in enumerate(users):
#         if user.id == user_id:
#             user.full_name = user_update.full_name
#             user.birthday = user_update.birthday
#             user.gender = user_update.gender
#             user.phone_number = user_update.phone_number
#             user.address = user_update.address
#             user.email = user_update.email
#             user.introduction = user_update.introduction
#             user.updated_at = datetime.now()
#             users[i] = user
#             return user
#     raise HTTPException(status_code=404, detail="User not found")

# @app.delete("/api/v1/user/{user_id}")
# def delete_user(user_id: str):
#     for i, user in enumerate(users):
#         if user.id == user_id:
#             del users[i]
#             return {"message": "User deleted"}
#     raise HTTPException(status_code=404, detail="User not found")
## 
Docker là một nền tảng ảo hóa nhẹ (containerization platform) cho phép các ứng dụng được đóng gói và chạy trên các container. Mỗi container đóng gói một ứng dụng và tất cả các phụ thuộc của nó để có thể chạy độc lập trên bất kỳ môi trường nào.

Các lợi ích của Docker:

Được sử dụng độc lập với hệ điều hành. Xây dựng, gia hạn, nâng cấp, xóa và quản lý một ứng dụng mà không ảnh hưởng đến phần còn lại của hệ thống.
Giảm thiểu sự cố do xung đột về thư viện và version.
Docker có khả năng tăng tốc độ triển khai.
Khả năng đóng gói môi trường thử nghiệm. Chỉ cần cài đặt môi trường ở một nơi và chia sẻ một máy ảo cho mọi người để tiếp cận.
Tự động hóa các tác vụ cài đặt ứng dụng.
Để tạo một container, ta sử dụng một Dockerfile để mô tả cấu hình của container. Sau đó ta sử dụng lệnh `docker build` để tạo container từ file này. Sau khi tạo container, ta sử dụng lệnh `docker run` để chạy container và thực hiện các tác vụ mong muốn.
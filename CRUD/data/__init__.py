#data
# from schemas.user import User
# from datetime import datetime
from pymongo import MongoClient

client = MongoClient('mongodb://root:Tuan23032001@localhost:27018/')
db = client["CRUDFace"]

time_setting_db = db["time_setting"]
from schemas.setting import TimeSetting
from data import time_setting_db

class TimeSettingService:
    def save_setting(time_setting: TimeSetting):
        time_setting_res = time_setting_db.find_one({"id": 1})
        if time_setting_res is None:
            time_setting_db.insert_one(time_setting.dict())
        else:
            time_setting_db.update_one({"id": 1}, {"$set": time_setting.dict()})
        return time_setting
    
    def get_setting():
        time_setting_res = time_setting_db.find_one({"id": 1})
        if time_setting_res is None:
            time_setting_res = TimeSetting(hour=8, minute=0)
            time_setting_db.insert_one(time_setting_res.dict())
        return time_setting_res
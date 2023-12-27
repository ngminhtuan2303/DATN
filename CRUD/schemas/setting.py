from datetime import datetime
from pydantic import BaseModel

class TimeSetting(BaseModel):
    id: int = 1
    hour: int
    minute: int
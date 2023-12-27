#main
from fastapi import FastAPI
from api import router
from fastapi.middleware.cors import CORSMiddleware
# from milvus_collection import user
app = FastAPI()

app.include_router(router)

# @app.on_event("startup")
# def init_vector_db():
#     user.create_collections()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from fastapi import FastAPI
from routes.user import user

app = FastAPI(
    title="API de FastAPI-MongoDB",
    description="Esta es una api usando fastAPI Y MongoDB",
    version="1.0.0",
)

app.include_router(user)
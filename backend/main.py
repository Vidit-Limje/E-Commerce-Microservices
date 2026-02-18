from fastapi import FastAPI
from database import Base, engine
from routes.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Auth Service")
app.include_router(auth_router, prefix="/auth")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
import traceback

import models
from database import engine
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import skills, users

if os.getenv("CREATE_TABLES_ON_STARTUP") == "1":
    models.Base.metadata.create_all(bind=engine)


def get_allowed_origins() -> list[str]:
    configured_origins = os.getenv("CORS_ALLOWED_ORIGINS", "")
    origins = [
        origin.strip()
        for origin in configured_origins.split(",")
        if origin.strip()
    ]

    return origins or ["http://localhost:5173", "http://127.0.0.1:5173"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"UNHANDLED ERROR: {type(exc).__name__}: {exc}")
    traceback.print_exc()
    return JSONResponse(status_code=500, content={"detail": str(exc)})

app.include_router(users.router)
app.include_router(skills.router)


@app.get("/")
def read_root():
    return {"message": "Skating Tracker API is running"}

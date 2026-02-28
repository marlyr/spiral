from fastapi import FastAPI, status, Depends, HTTPException
from database import engine
import models
from routers import auth, skills

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)
app.include_router(skills.router)

@app.get("/")
def read_root():
    return {"message": "Skating Tracker API is running"}
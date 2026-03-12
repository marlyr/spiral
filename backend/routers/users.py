from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import User
from database import get_db
from schemas import UserResponse, TrackUpdate
from routers.auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/track", response_model=UserResponse)
def switch_track(track_update: TrackUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user.id).first()
    user.active_track = track_update.active_track
    db.commit()
    db.refresh(user)
    return user
    
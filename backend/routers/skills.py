from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import User, UserSkillStatus
from database import get_db
from schemas import SkillUpdate, UserSkillStatusResponse
from routers.auth import get_current_user

router = APIRouter(prefix="/skills", tags=["skills"])

@router.get("/", response_model=List[UserSkillStatusResponse])
def get_skills(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    statuses = db.query(UserSkillStatus).filter(
        UserSkillStatus.user_id == current_user.id
    ).all()

    return statuses


@router.patch("/{skill_id}", response_model=UserSkillStatusResponse)
def update_skill(skill_id: int, update: SkillUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    status_row = db.query(UserSkillStatus).filter(
        UserSkillStatus.skill_id == skill_id,
        UserSkillStatus.user_id == current_user.id
    ).first()
    
    if status_row is None:
        raise HTTPException(status_code=404, detail="Skill not found")

    status_row.status = update.status
    db.commit()
    db.refresh(status_row)

    return status_row
    
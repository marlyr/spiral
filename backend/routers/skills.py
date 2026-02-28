from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import User, UserSkillStatus
from database import get_db
from schemas import SkillResponse, SkillUpdate
from routers.auth import get_current_user

router = APIRouter(prefix="/skills", tags=["skills"])

@router.get("/", response_model=List[SkillResponse])
def get_skills(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    statuses = db.query(UserSkillStatus).filter(
        UserSkillStatus.user_id == current_user.id
    ).all()
    
    return [
        SkillResponse(
            id=s.skill.id,
            name=s.skill.name,
            track=s.skill.track,
            level=s.skill.level,
            bonus=s.skill.bonus,
            status=s.status
        )
        for s in statuses
    ]

@router.patch("/{skill_id}", response_model=SkillResponse)
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

    return SkillResponse(
        id=status_row.skill.id,
        name=status_row.skill.name,
        track=status_row.skill.track,
        level=status_row.skill.level,
        bonus=status_row.skill.bonus,
        status=status_row.status
    )
    
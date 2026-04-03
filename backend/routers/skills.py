from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import User, UserSkillStatus, Skill
from database import get_db
from schemas import SkillUpdate, UserSkillStatusResponse
from routers.auth import get_current_user

router = APIRouter(prefix="/skills", tags=["skills"])

@router.get("/", response_model=List[UserSkillStatusResponse])
def get_skills(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_skills = (
        db.query(UserSkillStatus)
        .join(UserSkillStatus.skill)
        .filter(UserSkillStatus.user_id == current_user.id)
        .filter(Skill.track == current_user.active_track)
        .all()
    )
        
    return [
        {
            "status": s.status,
            "id": s.id,
            "name": s.skill.name,
            "track": s.skill.track,
            "level": s.skill.level,
            "category": s.skill.category,
            "bonus": s.skill.bonus
        } for s in user_skills
    ]


@router.patch("/{user_skill_id}", response_model=UserSkillStatusResponse)
def update_skill(user_skill_id: int, update: SkillUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    status_row = db.query(UserSkillStatus).filter(
        UserSkillStatus.id == user_skill_id,
        UserSkillStatus.user_id == current_user.id,
    ).first()
    
    if status_row is None:
        raise HTTPException(status_code=404, detail="Skill not found")

    status_row.status = update.status
    db.commit()
    db.refresh(status_row)
    
    return {
            "status": status_row.status,
            "id": status_row.id,
            "name": status_row.skill.name,
            "track": status_row.skill.track,
            "level": status_row.skill.level,
            "category": status_row.skill.category,
            "bonus": status_row.skill.bonus,
        }

    
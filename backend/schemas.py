from pydantic import BaseModel, Field
from typing import Optional
from models import SkatingTrack, SkillStatus, SkillCategory


class UserResponse(BaseModel):
    id: str
    email: str
    active_track: Optional[SkatingTrack] = None
    
    model_config = {"from_attributes": True}


class SkillUpdate(BaseModel):
    status: Optional[SkillStatus] = None
    notes: Optional[str] = Field(default=None, max_length=4000)


class SkillBase(BaseModel):
    id: int
    name: str
    track: SkatingTrack
    level: int
    category: SkillCategory
    bonus: bool


class UserSkillStatusResponse(BaseModel):
    status: SkillStatus
    id: int
    name: str
    track: SkatingTrack
    level: int
    category: SkillCategory
    bonus: bool
    notes: Optional[str] = None

    model_config = {"from_attributes": True}

class TrackUpdate(BaseModel):
    active_track: SkatingTrack

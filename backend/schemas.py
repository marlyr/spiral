from pydantic import BaseModel
from typing import Optional
from models import SkatingTrack, SkillStatus, SkillCategory

class UserCreate(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    active_track: Optional[SkatingTrack] = None
    
    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class SkillUpdate(BaseModel):
    status: SkillStatus


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

    model_config = {"from_attributes": True}

class TrackUpdate(BaseModel):
    active_track: SkatingTrack

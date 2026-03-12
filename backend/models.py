from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
from database import Base
from enum import StrEnum


class SkillStatus(StrEnum):
    not_started = "not_started"
    working_on = "working_on"
    completed = "completed"


class SkatingTrack(StrEnum):
    basic = "basic"
    adult = "adult"
    pre_freeskate = "pre_freeskate"
    freeskate = "freeskate"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String)
    active_track = Column(Enum(SkatingTrack), nullable=True)

    skill_statuses = relationship("UserSkillStatus", back_populates="user")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    track = Column(Enum(SkatingTrack), nullable=False)
    level = Column(Integer, nullable=False)
    bonus = Column(Boolean, nullable=False, default=False)

class UserSkillStatus(Base):
    __tablename__ = "user_skill_statuses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    status = Column(
        Enum(SkillStatus), default=SkillStatus.not_started, server_default=SkillStatus.not_started.value, nullable=False
    )

    user = relationship("User", back_populates="skill_statuses")
    skill = relationship("Skill")
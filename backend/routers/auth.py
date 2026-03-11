from datetime import timedelta, datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import User
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from dotenv import load_dotenv
import os
import bcrypt
from database import get_db
from schemas import UserCreate, UserResponse, Token, TokenData, TrackUpdate
from models import Skill, UserSkillStatus

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
TOKEN_EXPIRES = 30

oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/login")
router = APIRouter(prefix="/auth", tags=["auth"])


def verify_pwd(plain_pwd: str, hashed_pwd: str) -> bool:
    return bcrypt.checkpw(plain_pwd.encode("utf-8"), hashed_pwd.encode("utf-8"))


def get_pwd_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    

def verify_token(token: str) -> TokenData:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        
        if email is None:
            raise HTTPException(
                status_code=401,
                detail="Could not verify credentials",
                headers={"WWWW-Authenticate": "Bearer"}
            )
        return TokenData(email=email)
    except JWTError:
        raise HTTPException(
                status_code=401,
                detail="Could not verify credentials",
                headers={"WWWW-Authenticate": "Bearer"}
            )


def get_current_user(token: str = Depends(oauth2_bearer), db: Session = Depends(get_db)):
    token_data = verify_token(token)
    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        raise HTTPException(
                status_code=404,
                detail="User does not exist",
                headers={"WWWW-Authenticate": "Bearer"}
            )
    return user

    
@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    hashed_password = get_pwd_hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.flush()
    
    all_skills = db.query(Skill).all()
    for skill in all_skills:
        status_row = UserSkillStatus(
            user=db_user,
            skill=skill
        )
        db.add(status_row)
    db.commit()

    access_token_expires = timedelta(minutes=TOKEN_EXPIRES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    return{"access_token": access_token, "token_type": "bearer"}

    
@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if user is None or not verify_pwd(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Could not verify credentials"
        )
    
    access_token_expires = timedelta(minutes=TOKEN_EXPIRES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    return{"access_token": access_token, "token_type": "bearer"}


@router.get("/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/verify-token")
def verify_token_endpoint(current_user: User = Depends(get_current_user)):
    return {
        "valid": True,
        "user": {
            "id": current_user.id,
            "email": current_user.email,
        }
    }

@router.patch("/track", response_model=UserResponse)
def switch_track(track_update: TrackUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user.id).first()
    user.active_track = track_update.active_track
    db.commit()
    db.refresh(user)
    return user
    
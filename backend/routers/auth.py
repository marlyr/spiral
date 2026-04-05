from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models import User
from dotenv import load_dotenv
import jwt
import os
import uuid

load_dotenv()

SUPABASE_JWKS_URL = os.getenv("SUPABASE_JWKS_URL")

security = HTTPBearer()

jwks_client = jwt.PyJWKClient(SUPABASE_JWKS_URL)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256", "RS256"],
            audience="authenticated"
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

    user = db.query(User).filter(User.id == uuid.UUID(user_id)).first()
    if user is None:  # fallback in case trigger insert fails
        email = payload.get("email", "")
        user = User(id=uuid.UUID(user_id), email=email)
        db.add(user)
        db.commit()
        db.refresh(user)

    return user

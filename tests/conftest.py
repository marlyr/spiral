import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BACKEND_DIR = ROOT / "backend"

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")
os.environ.setdefault(
    "SUPABASE_JWKS_URL",
    "https://example.supabase.co/auth/v1/.well-known/jwks.json",
)
os.environ.setdefault("SUPABASE_ISSUER", "https://example.supabase.co/auth/v1")

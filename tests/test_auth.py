import uuid
from types import SimpleNamespace

import pytest
from fastapi import Depends, FastAPI
from fastapi.testclient import TestClient
from models import User
from routers import auth


class FakeQuery:
    def __init__(self, result):
        self.result = result

    def filter(self, *args, **kwargs):
        return self

    def first(self):
        return self.result


class FakeDb:
    def __init__(self, user=None):
        self.user = user
        self.added = []
        self.committed = False
        self.refreshed = []

    def query(self, model):
        return FakeQuery(self.user)

    def add(self, item):
        self.added.append(item)
        self.user = item

    def commit(self):
        self.committed = True

    def refresh(self, item):
        self.refreshed.append(item)


@pytest.fixture
def app():
    test_app = FastAPI()

    @test_app.get("/protected")
    def protected(current_user: User = Depends(auth.get_current_user)):
        return {"email": current_user.email}

    return test_app


def override_db(fake_db):
    def _override():
        yield fake_db

    return _override


def mock_valid_jwt(monkeypatch, payload):
    monkeypatch.setattr(
        auth.jwks_client,
        "get_signing_key_from_jwt",
        lambda token: SimpleNamespace(key="test-key"),
    )
    monkeypatch.setattr(auth.jwt, "decode", lambda *args, **kwargs: payload)


def test_missing_token_returns_401(app):
    client = TestClient(app)

    response = client.get("/protected")

    assert response.status_code == 401


def test_invalid_token_returns_401(app, monkeypatch):
    fake_db = FakeDb()
    app.dependency_overrides[auth.get_db] = override_db(fake_db)
    monkeypatch.setattr(
        auth.jwks_client,
        "get_signing_key_from_jwt",
        lambda token: SimpleNamespace(key="test-key"),
    )

    def raise_invalid(*args, **kwargs):
        raise auth.jwt.InvalidIssuerError("bad issuer")

    monkeypatch.setattr(auth.jwt, "decode", raise_invalid)
    client = TestClient(app)

    response = client.get("/protected", headers={"Authorization": "Bearer bad-token"})

    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid token"}


def test_expired_token_returns_401(app, monkeypatch):
    fake_db = FakeDb()
    app.dependency_overrides[auth.get_db] = override_db(fake_db)
    monkeypatch.setattr(
        auth.jwks_client,
        "get_signing_key_from_jwt",
        lambda token: SimpleNamespace(key="test-key"),
    )

    def raise_expired(*args, **kwargs):
        raise auth.jwt.ExpiredSignatureError("expired")

    monkeypatch.setattr(auth.jwt, "decode", raise_expired)
    client = TestClient(app)

    response = client.get("/protected", headers={"Authorization": "Bearer expired-token"})

    assert response.status_code == 401
    assert response.json() == {"detail": "Token expired"}


def test_token_missing_required_claims_returns_401(app, monkeypatch):
    fake_db = FakeDb()
    app.dependency_overrides[auth.get_db] = override_db(fake_db)
    monkeypatch.setattr(
        auth.jwks_client,
        "get_signing_key_from_jwt",
        lambda token: SimpleNamespace(key="test-key"),
    )

    def raise_missing_claim(*args, **kwargs):
        raise auth.jwt.MissingRequiredClaimError("sub")

    monkeypatch.setattr(auth.jwt, "decode", raise_missing_claim)
    client = TestClient(app)

    response = client.get("/protected", headers={"Authorization": "Bearer missing-claims"})

    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid token"}


def test_valid_token_returns_current_user(app, monkeypatch):
    user = User(
        id=uuid.uuid4(),
        email="skater@example.com",
    )
    fake_db = FakeDb(user=user)
    app.dependency_overrides[auth.get_db] = override_db(fake_db)
    mock_valid_jwt(
        monkeypatch,
        {
            "sub": str(user.id),
            "email": user.email,
            "aud": "authenticated",
            "iss": "https://example.supabase.co/auth/v1",
            "iat": 1,
            "exp": 9999999999,
            "role": "authenticated",
        },
    )
    client = TestClient(app)

    response = client.get("/protected", headers={"Authorization": "Bearer good-token"})

    assert response.status_code == 200
    assert response.json() == {"email": "skater@example.com"}


def test_new_user_is_created_from_valid_token(app, monkeypatch):
    fake_db = FakeDb()
    app.dependency_overrides[auth.get_db] = override_db(fake_db)
    new_user_id = uuid.uuid4()
    mock_valid_jwt(
        monkeypatch,
        {
            "sub": str(new_user_id),
            "email": "new-user@example.com",
            "aud": "authenticated",
            "iss": "https://example.supabase.co/auth/v1",
            "iat": 1,
            "exp": 9999999999,
            "role": "authenticated",
        },
    )
    client = TestClient(app)

    response = client.get("/protected", headers={"Authorization": "Bearer good-token"})

    assert response.status_code == 200
    assert response.json() == {"email": "new-user@example.com"}
    assert len(fake_db.added) == 1
    assert fake_db.committed is True

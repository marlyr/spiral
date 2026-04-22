import uuid

import pytest

from models import Skill, SkillCategory, SkillStatus, SkatingTrack, User, UserSkillStatus
from routers import skills, users
from schemas import SkillUpdate, TrackUpdate


class FakeQuery:
    def __init__(self, result):
        self.result = result

    def join(self, *args, **kwargs):
        return self

    def filter(self, *args, **kwargs):
        return self

    def first(self):
        return self.result

    def all(self):
        if self.result is None:
            return []
        return self.result

    def __iter__(self):
        return iter(self.all())


class FakeDb:
    def __init__(self, responses=None):
        self.responses = responses or {}
        self.added = []
        self.committed = False
        self.refreshed = []

    def query(self, model):
        return FakeQuery(self.responses.get(model))

    def add(self, item):
        self.added.append(item)

    def commit(self):
        self.committed = True

    def refresh(self, item):
        self.refreshed.append(item)


def test_get_profile_returns_authenticated_user():
    current_user = User(id=uuid.uuid4(), email="profile@example.com")

    result = users.get_profile(current_user=current_user)

    assert result is current_user


def test_switch_track_creates_missing_status_rows_for_current_user():
    current_user = User(
        id=uuid.uuid4(),
        email="switch@example.com",
        active_track=SkatingTrack.basic,
    )
    track_skill = Skill(
        id=1,
        name="Forward marching",
        track=SkatingTrack.adult,
        level=1,
        category=SkillCategory.foundation,
        bonus=False,
    )
    fake_db = FakeDb(
        responses={
            User: current_user,
            Skill: [track_skill],
            UserSkillStatus: None,
        }
    )

    result = users.switch_track(
        TrackUpdate(active_track=SkatingTrack.adult),
        current_user=current_user,
        db=fake_db,
    )

    assert result.active_track == SkatingTrack.adult
    assert len(fake_db.added) == 1
    added_status = fake_db.added[0]
    assert added_status.user is current_user
    assert added_status.skill is track_skill
    assert fake_db.committed is True


def test_update_skill_rejects_other_users_skill():
    current_user = User(id=uuid.uuid4(), email="owner@example.com")
    fake_db = FakeDb(responses={UserSkillStatus: None})

    with pytest.raises(skills.HTTPException) as exc_info:
        skills.update_skill(
            123,
            SkillUpdate(status=SkillStatus.completed),
            current_user=current_user,
            db=fake_db,
        )

    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Skill not found"


def test_update_skill_only_changes_owned_record():
    current_user = User(
        id=uuid.uuid4(),
        email="owner@example.com",
        active_track=SkatingTrack.basic,
    )
    skill = Skill(
        id=7,
        name="Dip",
        track=SkatingTrack.basic,
        level=1,
        category=SkillCategory.foundation,
        bonus=False,
    )
    status_row = UserSkillStatus(
        id=7,
        user_id=current_user.id,
        skill_id=skill.id,
        status=SkillStatus.not_started,
        notes=None,
    )
    status_row.skill = skill
    fake_db = FakeDb(responses={UserSkillStatus: status_row})

    result = skills.update_skill(
        7,
        SkillUpdate(status=SkillStatus.working_on, notes="Practiced today"),
        current_user=current_user,
        db=fake_db,
    )

    assert status_row.status == SkillStatus.working_on
    assert status_row.notes == "Practiced today"
    assert fake_db.committed is True
    assert result["status"] == SkillStatus.working_on
    assert result["notes"] == "Practiced today"

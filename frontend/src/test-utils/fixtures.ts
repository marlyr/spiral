import type { Session, User } from "@supabase/supabase-js";
import type { UserSkill } from "@/types";

export function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: "user-1",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: "2026-01-01T00:00:00.000Z",
    email: "skater@example.com",
    role: "authenticated",
    ...overrides,
  } as User;
}

export function makeSession(overrides: Partial<Session> = {}): Session {
  return {
    access_token: "access-token",
    refresh_token: "refresh-token",
    expires_in: 3600,
    expires_at: 1_900_000_000,
    token_type: "bearer",
    user: makeUser(),
    ...overrides,
  } as Session;
}

export function makeSkill(overrides: Partial<UserSkill> = {}): UserSkill {
  return {
    id: 1,
    name: "Forward swizzles",
    track: "basic",
    level: 1,
    category: "foundation",
    bonus: false,
    notes: "Keep knees soft",
    status: "not_started",
    ...overrides,
  };
}

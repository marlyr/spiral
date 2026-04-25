import {
  createClient,
  type AuthChangeEvent,
  type Session,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isE2E = import.meta.env.VITE_E2E === "true";

if (!isE2E && !supabaseUrl) {
  throw new Error("VITE_SUPABASE_URL is required");
}

if (!isE2E && !supabaseAnonKey) {
  throw new Error("VITE_SUPABASE_ANON_KEY is required");
}

const e2eSessionKey = "spiral:e2e-session";
const e2eEmail = "skater@example.com";
const e2ePassword = "password123";

type AuthStateChangeCallback = (
  event: AuthChangeEvent,
  session: Session | null,
) => unknown;

function makeE2EUser(email = e2eEmail): User {
  return {
    id: "e2e-user-1",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: "2026-01-01T00:00:00.000Z",
    email,
    role: "authenticated",
  } as User;
}

function makeE2ESession(email = e2eEmail): Session {
  return {
    access_token: "e2e-access-token",
    refresh_token: "e2e-refresh-token",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: "bearer",
    user: makeE2EUser(email),
  } as Session;
}

function getStoredE2ESession() {
  if (typeof localStorage === "undefined") return null;

  const value = localStorage.getItem(e2eSessionKey);
  if (!value) return null;

  try {
    return JSON.parse(value) as Session;
  } catch {
    localStorage.removeItem(e2eSessionKey);
    return null;
  }
}

function setStoredE2ESession(session: Session | null) {
  if (typeof localStorage === "undefined") return;

  if (session) {
    localStorage.setItem(e2eSessionKey, JSON.stringify(session));
  } else {
    localStorage.removeItem(e2eSessionKey);
  }
}

function isPasswordRecoveryRedirect() {
  if (typeof window === "undefined") return false;

  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));

  return search.get("type") === "recovery" || hash.get("type") === "recovery";
}

function createE2ESupabaseClient() {
  const callbacks = new Set<AuthStateChangeCallback>();

  function emit(event: AuthChangeEvent, session: Session | null) {
    callbacks.forEach((callback) => callback(event, session));
  }

  return {
    auth: {
      async getSession() {
        return { data: { session: getStoredE2ESession() }, error: null };
      },
      onAuthStateChange(callback: AuthStateChangeCallback) {
        callbacks.add(callback);

        if (isPasswordRecoveryRedirect()) {
          setTimeout(
            () => callback("PASSWORD_RECOVERY", getStoredE2ESession()),
            0,
          );
        }

        return {
          data: {
            subscription: {
              unsubscribe: () => callbacks.delete(callback),
            },
          },
        };
      },
      async signInWithPassword({
        email,
        password,
      }: {
        email: string;
        password: string;
      }) {
        if (email !== e2eEmail || password !== e2ePassword) {
          return {
            data: { user: null, session: null },
            error: new Error("Invalid login credentials"),
          };
        }

        const session = makeE2ESession(email);
        setStoredE2ESession(session);
        emit("SIGNED_IN", session);

        return { data: { user: session.user, session }, error: null };
      },
      async signOut() {
        setStoredE2ESession(null);
        emit("SIGNED_OUT", null);

        return { error: null };
      },
      async signUp({ email }: { email: string; password: string }) {
        return {
          data: { user: makeE2EUser(email), session: null },
          error: null,
        };
      },
      async resetPasswordForEmail() {
        return { data: {}, error: null };
      },
      async updateUser() {
        const session = getStoredE2ESession() ?? makeE2ESession();
        setStoredE2ESession(session);
        emit("USER_UPDATED", session);

        return { data: { user: session.user }, error: null };
      },
    },
  };
}

export const supabase: SupabaseClient = isE2E
  ? (createE2ESupabaseClient() as unknown as SupabaseClient)
  : createClient(supabaseUrl, supabaseAnonKey);

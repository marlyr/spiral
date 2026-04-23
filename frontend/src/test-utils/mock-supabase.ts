import type { Session } from "@supabase/supabase-js";
import { vi } from "vitest";

type AuthStateChangeCallback = (
  event: string,
  session: Session | null,
) => unknown;

export function createMockSupabase() {
  let authStateChangeCallback: AuthStateChangeCallback | undefined;
  const subscription = {
    unsubscribe: vi.fn(),
  };

  const supabase = {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn((callback: AuthStateChangeCallback) => {
        authStateChangeCallback = callback;
        return { data: { subscription } };
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
      signUp: vi.fn().mockResolvedValue({ error: null }),
      resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
      updateUser: vi.fn().mockResolvedValue({ error: null }),
    },
  };

  return {
    supabase,
    subscription,
    emitAuthStateChange(event: string, session: Session | null) {
      return authStateChangeCallback?.(event, session);
    },
  };
}

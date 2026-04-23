import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createMockSupabase } from "@/test-utils/mock-supabase";
import { makeSession, makeUser } from "@/test-utils/fixtures";

async function loadAuthContext() {
  vi.resetModules();
  const mockSupabase = createMockSupabase();
  vi.doMock("@/lib/supabase", () => ({ supabase: mockSupabase.supabase }));
  const authContext = await import("@/context/auth-context");

  return { ...authContext, mockSupabase };
}

afterEach(() => {
  vi.doUnmock("@/lib/supabase");
  vi.resetModules();
});

describe("AuthProvider", () => {
  it("exposes the active session and user after load", async () => {
    const { AuthProvider, useAuth, mockSupabase } = await loadAuthContext();
    mockSupabase.supabase.auth.getSession.mockResolvedValue({
      data: {
        session: makeSession({
          user: makeUser({ email: "skater@example.com" }),
        }),
      },
    });

    function AuthSnapshot() {
      const { loading, user, session } = useAuth();

      return (
        <>
          <div>{loading ? "loading" : "loaded"}</div>
          <div>{user?.email ?? "no-user"}</div>
          <div>{session?.access_token ?? "no-session"}</div>
        </>
      );
    }

    render(
      <AuthProvider>
        <AuthSnapshot />
      </AuthProvider>,
    );

    expect(await screen.findByText("loaded")).toBeInTheDocument();
    expect(screen.getByText("skater@example.com")).toBeInTheDocument();
    expect(screen.getByText("access-token")).toBeInTheDocument();
  });

  it("clears auth state when no session exists", async () => {
    const { AuthProvider, useAuth } = await loadAuthContext();

    function AuthSnapshot() {
      const { loading, user } = useAuth();

      return (
        <>
          <div>{loading ? "loading" : "loaded"}</div>
          <div>{user?.email ?? "no-user"}</div>
        </>
      );
    }

    render(
      <AuthProvider>
        <AuthSnapshot />
      </AuthProvider>,
    );

    expect(await screen.findByText("loaded")).toBeInTheDocument();
    expect(screen.getByText("no-user")).toBeInTheDocument();
  });

  it("updates auth state when Supabase auth events fire", async () => {
    const { AuthProvider, useAuth, mockSupabase } = await loadAuthContext();

    function AuthSnapshot() {
      const { loading, user } = useAuth();

      return (
        <>
          <div>{loading ? "loading" : "loaded"}</div>
          <div>{user?.email ?? "no-user"}</div>
        </>
      );
    }

    render(
      <AuthProvider>
        <AuthSnapshot />
      </AuthProvider>,
    );

    expect(await screen.findByText("loaded")).toBeInTheDocument();
    expect(screen.getByText("no-user")).toBeInTheDocument();

    await act(async () => {
      await mockSupabase.emitAuthStateChange(
        "SIGNED_IN",
        makeSession({
          user: makeUser({ email: "updated@example.com" }),
        }),
      );
    });

    expect(screen.getByText("updated@example.com")).toBeInTheDocument();
  });

  it("calls Supabase signOut through the context", async () => {
    const { AuthProvider, useAuth, mockSupabase } = await loadAuthContext();
    const user = userEvent.setup();

    function SignOutButton() {
      const { signOut } = useAuth();

      return <button onClick={() => void signOut()}>Sign out</button>;
    }

    render(
      <AuthProvider>
        <SignOutButton />
      </AuthProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Sign out" }));

    expect(mockSupabase.supabase.auth.signOut).toHaveBeenCalledOnce();
  });

  it("throws when useAuth is called outside the provider", async () => {
    const { useAuth } = await loadAuthContext();
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    function BrokenConsumer() {
      useAuth();
      return null;
    }

    expect(() => render(<BrokenConsumer />)).toThrow(
      "useAuth must be used within an AuthProvider",
    );

    consoleErrorSpy.mockRestore();
  });

  it("unsubscribes from auth state changes on unmount", async () => {
    const { AuthProvider, mockSupabase } = await loadAuthContext();

    const { unmount } = render(
      <AuthProvider>
        <div>child</div>
      </AuthProvider>,
    );

    expect(mockSupabase.supabase.auth.onAuthStateChange).toHaveBeenCalledOnce();

    unmount();

    expect(mockSupabase.subscription.unsubscribe).toHaveBeenCalledOnce();
  });
});

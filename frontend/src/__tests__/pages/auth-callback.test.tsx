import { act, render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { server } from "@/test-utils/msw-server";
import { createMockSupabase } from "@/test-utils/mock-supabase";
import { makeSession } from "@/test-utils/fixtures";

async function loadAuthCallback() {
  vi.resetModules();
  const mockSupabase = createMockSupabase();
  mockSupabase.supabase.auth.getSession.mockResolvedValue({
    data: { session: makeSession() },
  });
  vi.doMock("@/lib/supabase", () => ({ supabase: mockSupabase.supabase }));
  const { default: AuthCallback } = await import("@/pages/AuthCallback");

  return { AuthCallback, mockSupabase };
}

function renderAuthCallback(
  AuthCallback: typeof import("@/pages/AuthCallback").default,
) {
  return render(
    <MemoryRouter initialEntries={["/auth/callback"]}>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        <Route
          path="/track-selection"
          element={<div>Track Selection Page</div>}
        />
        <Route
          path="/reset-password"
          element={<div>Reset Password Page</div>}
        />
      </Routes>
    </MemoryRouter>,
  );
}

afterEach(() => {
  vi.doUnmock("@/lib/supabase");
  vi.resetModules();
});

describe("AuthCallback", () => {
  it("navigates to /dashboard when the signed-in user already has a track", async () => {
    const { AuthCallback, mockSupabase } = await loadAuthCallback();
    renderAuthCallback(AuthCallback);

    await act(async () => {
      await mockSupabase.emitAuthStateChange("SIGNED_IN", makeSession());
    });

    expect(await screen.findByText("Dashboard Page")).toBeInTheDocument();
  });

  it("navigates to /track-selection when the signed-in user has no track", async () => {
    server.use(
      http.get("http://localhost:3000/users/profile", () =>
        HttpResponse.json({
          id: "user-1",
          email: "skater@example.com",
          active_track: null,
        }),
      ),
    );

    const { AuthCallback, mockSupabase } = await loadAuthCallback();
    renderAuthCallback(AuthCallback);

    await act(async () => {
      await mockSupabase.emitAuthStateChange("SIGNED_IN", makeSession());
    });

    expect(await screen.findByText("Track Selection Page")).toBeInTheDocument();
  });

  it("navigates to /reset-password for password recovery events", async () => {
    const { AuthCallback, mockSupabase } = await loadAuthCallback();
    renderAuthCallback(AuthCallback);

    await act(async () => {
      await mockSupabase.emitAuthStateChange("PASSWORD_RECOVERY", null);
    });

    expect(await screen.findByText("Reset Password Page")).toBeInTheDocument();
  });

  it("unsubscribes from auth state changes on unmount", async () => {
    const { AuthCallback, mockSupabase } = await loadAuthCallback();
    const { unmount } = renderAuthCallback(AuthCallback);

    unmount();

    expect(mockSupabase.subscription.unsubscribe).toHaveBeenCalledOnce();
  });
});

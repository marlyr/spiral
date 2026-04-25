import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ProtectedRoute } from "@/components/protected-route";
import { MockAuthProvider } from "@/test-utils/MockAuthProvider";
import { makeSession } from "@/test-utils/fixtures";
import { server } from "@/test-utils/msw-server";

function renderProtectedRoute({
  loading = false,
  session = null,
  requireTrack = false,
}: {
  loading?: boolean;
  session?: ReturnType<typeof makeSession> | null;
  requireTrack?: boolean;
}) {
  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <MockAuthProvider value={{ loading, session }}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/track-selection"
            element={<div>Track Selection Page</div>}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireTrack={requireTrack}>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MockAuthProvider>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  it("redirects logged-out users to /login", async () => {
    renderProtectedRoute({ session: null });

    expect(await screen.findByText("Login Page")).toBeInTheDocument();
  });

  it("renders nothing while auth state is loading", () => {
    renderProtectedRoute({ loading: true });

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });

  it("renders children when a session exists", () => {
    renderProtectedRoute({ session: makeSession() });

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to track selection when a required track is missing", async () => {
    server.use(
      http.get("http://localhost:3000/users/profile", () =>
        HttpResponse.json({
          id: "user-1",
          email: "skater@example.com",
          active_track: null,
        }),
      ),
    );

    renderProtectedRoute({ session: makeSession(), requireTrack: true });

    expect(await screen.findByText("Track Selection Page")).toBeInTheDocument();
  });
});

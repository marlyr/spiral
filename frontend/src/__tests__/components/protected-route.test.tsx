import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ProtectedRoute } from "@/components/protected-route";
import { MockAuthProvider } from "@/test-utils/MockAuthProvider";
import { makeSession } from "@/test-utils/fixtures";

function renderProtectedRoute({
  loading = false,
  session = null,
}: {
  loading?: boolean;
  session?: ReturnType<typeof makeSession> | null;
}) {
  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <MockAuthProvider value={{ loading, session }}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
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
});

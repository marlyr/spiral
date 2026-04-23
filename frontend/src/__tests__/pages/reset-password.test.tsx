import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createMockSupabase } from "@/test-utils/mock-supabase";

async function loadResetPassword() {
  vi.resetModules();
  const mockSupabase = createMockSupabase();
  vi.doMock("@/lib/supabase", () => ({ supabase: mockSupabase.supabase }));
  const { default: ResetPassword } = await import("@/pages/ResetPassword");

  return { ResetPassword, mockSupabase };
}

function renderResetPassword(
  ResetPassword: typeof import("@/pages/ResetPassword").default,
) {
  render(
    <MemoryRouter initialEntries={["/reset-password"]}>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<div>Dashboard Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

afterEach(() => {
  vi.doUnmock("@/lib/supabase");
  vi.resetModules();
});

describe("ResetPassword", () => {
  it("shows a password length validation error", async () => {
    const { ResetPassword } = await loadResetPassword();
    const user = userEvent.setup();
    renderResetPassword(ResetPassword);

    await user.type(screen.getByLabelText("New Password"), "short");
    await user.type(screen.getByLabelText("Confirm Password"), "short");
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(
      await screen.findByText("Password must be at least 8 characters"),
    ).toBeInTheDocument();
  });

  it("shows an error when passwords do not match", async () => {
    const { ResetPassword } = await loadResetPassword();
    const user = userEvent.setup();
    renderResetPassword(ResetPassword);

    await user.type(screen.getByLabelText("New Password"), "secret123");
    await user.type(screen.getByLabelText("Confirm Password"), "different123");
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(await screen.findByText("Passwords do not match")).toBeInTheDocument();
  });

  it("surfaces a generic error when updateUser fails", async () => {
    const { ResetPassword, mockSupabase } = await loadResetPassword();
    const user = userEvent.setup();
    mockSupabase.supabase.auth.updateUser.mockResolvedValue({
      error: { message: "Update failed" },
    });
    renderResetPassword(ResetPassword);

    await user.type(screen.getByLabelText("New Password"), "secret123");
    await user.type(screen.getByLabelText("Confirm Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
  });

  it("navigates to /dashboard when the password reset succeeds", async () => {
    const { ResetPassword } = await loadResetPassword();
    const user = userEvent.setup();
    renderResetPassword(ResetPassword);

    await user.type(screen.getByLabelText("New Password"), "secret123");
    await user.type(screen.getByLabelText("Confirm Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(await screen.findByText("Dashboard Page")).toBeInTheDocument();
  });
});

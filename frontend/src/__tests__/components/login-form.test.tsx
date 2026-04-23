import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createMockSupabase } from "@/test-utils/mock-supabase";

async function loadLoginForm() {
  vi.resetModules();
  const mockSupabase = createMockSupabase();
  vi.doMock("@/lib/supabase", () => ({ supabase: mockSupabase.supabase }));
  const { LoginForm } = await import("@/components/login-form");

  return { LoginForm, mockSupabase };
}

function renderLoginForm(LoginForm: typeof import("@/components/login-form").LoginForm) {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<div>Dashboard Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

afterEach(() => {
  vi.doUnmock("@/lib/supabase");
  vi.resetModules();
});

describe("LoginForm", () => {
  it("calls signInWithPassword with the submitted credentials", async () => {
    const { LoginForm, mockSupabase } = await loadLoginForm();
    const user = userEvent.setup();
    renderLoginForm(LoginForm);

    await user.type(screen.getByLabelText("Email"), "skater@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(mockSupabase.supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "skater@example.com",
      password: "secret123",
    });
  });

  it("shows an error when Supabase returns a login error", async () => {
    const { LoginForm, mockSupabase } = await loadLoginForm();
    const user = userEvent.setup();
    mockSupabase.supabase.auth.signInWithPassword.mockResolvedValue({
      error: { message: "Invalid login" },
    });
    renderLoginForm(LoginForm);

    await user.type(screen.getByLabelText("Email"), "skater@example.com");
    await user.type(screen.getByLabelText("Password"), "wrongpass");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(
      await screen.findByText("Incorrect email or password"),
    ).toBeInTheDocument();
  });

  it("navigates to /dashboard when login succeeds", async () => {
    const { LoginForm } = await loadLoginForm();
    const user = userEvent.setup();
    renderLoginForm(LoginForm);

    await user.type(screen.getByLabelText("Email"), "skater@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Dashboard Page")).toBeInTheDocument();
  });
});

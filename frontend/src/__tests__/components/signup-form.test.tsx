import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createMockSupabase } from "@/test-utils/mock-supabase";

async function loadSignupForm() {
  vi.resetModules();
  const mockSupabase = createMockSupabase();
  vi.doMock("@/lib/supabase", () => ({ supabase: mockSupabase.supabase }));
  const { SignupForm } = await import("@/components/signup-form");

  return { SignupForm, mockSupabase };
}

function renderSignupForm(
  SignupForm: typeof import("@/components/signup-form").SignupForm,
) {
  render(
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="/register" element={<SignupForm />} />
        <Route path="/check-email" element={<div>Check Email Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

afterEach(() => {
  vi.doUnmock("@/lib/supabase");
  vi.resetModules();
});

describe("SignupForm", () => {
  it("shows a password length validation error", async () => {
    const { SignupForm } = await loadSignupForm();
    const user = userEvent.setup();
    renderSignupForm(SignupForm);

    await user.type(screen.getByLabelText("Email"), "skater@example.com");
    await user.type(screen.getByLabelText("Password"), "short");
    await user.type(screen.getByLabelText("Confirm Password"), "short");
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    expect(
      await screen.findByText("Password must be at least 8 characters"),
    ).toBeInTheDocument();
  });

  it("shows an error when passwords do not match", async () => {
    const { SignupForm } = await loadSignupForm();
    const user = userEvent.setup();
    renderSignupForm(SignupForm);

    await user.type(screen.getByLabelText("Email"), "skater@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.type(screen.getByLabelText("Confirm Password"), "different123");
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    expect(
      await screen.findByText("Passwords do not match"),
    ).toBeInTheDocument();
  });

  it("calls signUp with the submitted credentials", async () => {
    const { SignupForm, mockSupabase } = await loadSignupForm();
    const user = userEvent.setup();
    renderSignupForm(SignupForm);

    await user.type(screen.getByLabelText("Email"), "skater@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.type(screen.getByLabelText("Confirm Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    expect(mockSupabase.supabase.auth.signUp).toHaveBeenCalledWith({
      email: "skater@example.com",
      password: "secret123",
      options: {
        emailRedirectTo: "http://localhost:3000/auth/callback",
      },
    });
  });

  it("surfaces Supabase signup errors", async () => {
    const { SignupForm, mockSupabase } = await loadSignupForm();
    const user = userEvent.setup();
    mockSupabase.supabase.auth.signUp.mockResolvedValue({
      error: { message: "Email already registered" },
    });
    renderSignupForm(SignupForm);

    await user.type(screen.getByLabelText("Email"), "skater@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.type(screen.getByLabelText("Confirm Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    expect(
      await screen.findByText("Email already registered"),
    ).toBeInTheDocument();
  });

  it("navigates to /check-email when signup succeeds", async () => {
    const { SignupForm } = await loadSignupForm();
    const user = userEvent.setup();
    renderSignupForm(SignupForm);

    await user.type(screen.getByLabelText("Email"), "skater@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.type(screen.getByLabelText("Confirm Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    expect(await screen.findByText("Check Email Page")).toBeInTheDocument();
  });
});

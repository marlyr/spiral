import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createMockSupabase } from "@/test-utils/mock-supabase";

async function loadForgotPassword() {
  vi.resetModules();
  const mockSupabase = createMockSupabase();
  vi.doMock("@/lib/supabase", () => ({ supabase: mockSupabase.supabase }));
  const { default: ForgotPassword } = await import("@/pages/ForgotPassword");

  return { ForgotPassword, mockSupabase };
}

afterEach(() => {
  vi.doUnmock("@/lib/supabase");
  vi.resetModules();
});

describe("ForgotPassword", () => {
  it("shows loading state and then success after sending a reset email", async () => {
    const { ForgotPassword, mockSupabase } = await loadForgotPassword();
    const user = userEvent.setup();

    let resolveRequest: ((value: { error: null }) => void) | undefined;
    mockSupabase.supabase.auth.resetPasswordForEmail.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );

    render(<ForgotPassword />);

    await user.type(screen.getByLabelText("Email"), "skater@example.com");
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(
      await screen.findByText("Sending reset link..."),
    ).toBeInTheDocument();

    resolveRequest?.({ error: null });

    expect(
      await screen.findByText(
        "If an account exists for this email, a reset link has been sent.",
      ),
    ).toBeInTheDocument();
  });

  it("shows an error when resetPasswordForEmail fails", async () => {
    const { ForgotPassword, mockSupabase } = await loadForgotPassword();
    const user = userEvent.setup();
    mockSupabase.supabase.auth.resetPasswordForEmail.mockResolvedValue({
      error: { message: "Something went wrong" },
    });

    render(<ForgotPassword />);

    await user.type(screen.getByLabelText("Email"), "skater@example.com");
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(
      await screen.findByText("Something went wrong, please try again."),
    ).toBeInTheDocument();
  });
});

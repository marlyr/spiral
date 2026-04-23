import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AvatarDropdown } from "@/components/avatar-dropdown";
import { MockAuthProvider } from "@/test-utils/MockAuthProvider";
import { makeUser } from "@/test-utils/fixtures";

describe("AvatarDropdown", () => {
  it("opens the menu when the avatar is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <MockAuthProvider value={{ user: makeUser() }}>
          <Routes>
            <Route path="/dashboard" element={<AvatarDropdown />} />
          </Routes>
        </MockAuthProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button"));

    expect(await screen.findByText("Log out")).toBeInTheDocument();
    expect(screen.getByText("Change track")).toBeInTheDocument();
  });

  it("calls signOut and navigates to /login", async () => {
    const user = userEvent.setup();
    const signOut = vi.fn().mockResolvedValue(undefined);

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <MockAuthProvider value={{ user: makeUser(), signOut }}>
          <Routes>
            <Route path="/dashboard" element={<AvatarDropdown />} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MockAuthProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Log out"));

    expect(signOut).toHaveBeenCalledOnce();
    expect(await screen.findByText("Login Page")).toBeInTheDocument();
  });
});

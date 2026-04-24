import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { TrackSelection } from "@/components/track-selection";
import { server } from "@/test-utils/msw-server";

vi.mock("@/lib/supabase", async () => {
  const { createMockSupabase } = await import("@/test-utils/mock-supabase");
  return { supabase: createMockSupabase().supabase };
});

describe("TrackSelection", () => {
  it("navigates to /dashboard when track selection succeeds", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/track-selection"]}>
        <Routes>
          <Route path="/track-selection" element={<TrackSelection />} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /basic skills/i }));

    expect(await screen.findByText("Dashboard Page")).toBeInTheDocument();
  });

  it("shows an error message when track selection fails", async () => {
    const user = userEvent.setup();
    server.use(
      http.patch("http://localhost:3000/users/track", () =>
        HttpResponse.json({ message: "Failed" }, { status: 500 }),
      ),
    );

    render(
      <MemoryRouter initialEntries={["/track-selection"]}>
        <Routes>
          <Route path="/track-selection" element={<TrackSelection />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /basic skills/i }));

    expect(
      await screen.findByText("Something went wrong, please try again"),
    ).toBeInTheDocument();
  });
});

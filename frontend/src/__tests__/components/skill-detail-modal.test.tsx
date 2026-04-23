import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { SkillDetailModal } from "@/components/skill-detail-modal";
import { Dialog } from "@/components/ui/dialog";
import { server } from "@/test-utils/msw-server";
import { makeSkill } from "@/test-utils/fixtures";

vi.mock("@/lib/supabase", async () => {
  const { createMockSupabase } = await import("@/test-utils/mock-supabase");
  return { supabase: createMockSupabase().supabase };
});

function renderModal(skill = makeSkill()) {
  return render(
    <Dialog defaultOpen>
      <SkillDetailModal skill={skill} />
    </Dialog>,
  );
}

describe("SkillDetailModal", () => {
  it("renders the skill details when open", async () => {
    renderModal(makeSkill({ level: 2, status: "working_on" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getAllByText("Forward swizzles")).not.toHaveLength(0);
    expect(screen.getByText("Level 2")).toBeInTheDocument();
    expect(screen.getByText("Working On")).toBeInTheDocument();
    expect(screen.getByText("My Notes")).toBeInTheDocument();
  });

  it("closes when the close button is clicked", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getAllByRole("button", { name: "Close" })[0]);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("autosaves notes after the debounce interval", async () => {
    vi.useFakeTimers();
    const savedBodies: Array<{ notes?: string }> = [];

    server.use(
      http.patch("http://localhost:3000/skills/:id", async ({ request }) => {
        savedBodies.push((await request.json()) as { notes?: string });
        return HttpResponse.json({ ok: true });
      }),
    );

    renderModal();

    const textbox = screen.getByRole("textbox");

    fireEvent.change(textbox, { target: { value: "Updated notes" } });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    vi.useRealTimers();

    await waitFor(() => {
      expect(savedBodies.at(-1)).toEqual({ notes: "Updated notes" });
    });
    expect(screen.getByText("Saved")).toBeVisible();
  });
});

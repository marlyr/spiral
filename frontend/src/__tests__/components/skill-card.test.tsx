import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SkillCard } from "@/components/skill-card";
import { makeSkill } from "@/test-utils/fixtures";

vi.mock("@/lib/supabase", async () => {
  const { createMockSupabase } = await import("@/test-utils/mock-supabase");
  return { supabase: createMockSupabase().supabase };
});

vi.mock("@dnd-kit/react", () => ({
  DragDropProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useDroppable: () => ({ ref: vi.fn() }),
}));

vi.mock("@dnd-kit/react/sortable", () => ({
  useSortable: () => ({ ref: vi.fn(), isDragSource: false }),
}));

describe("SkillCard", () => {
  it("renders the skill name and category badge", () => {
    render(<SkillCard skill={makeSkill()} />);

    expect(screen.getByText("Forward swizzles")).toBeInTheDocument();
    expect(screen.getByText("foundation")).toBeInTheDocument();
  });

  it("opens the skill detail modal when clicked", async () => {
    const user = userEvent.setup();

    render(<SkillCard skill={makeSkill()} />);

    await user.click(screen.getByText("Forward swizzles"));

    expect(await screen.findByText("My Notes")).toBeInTheDocument();
    expect(screen.getByText("Level 1")).toBeInTheDocument();
  });
});

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { KanbanBoard } from "@/components/kanban-board";
import { makeSkill } from "@/test-utils/fixtures";

vi.mock("@/lib/supabase", async () => {
  const { createMockSupabase } = await import("@/test-utils/mock-supabase");
  return { supabase: createMockSupabase().supabase };
});

vi.mock("@dnd-kit/react", () => ({
  DragDropProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useDraggable: () => ({ ref: vi.fn() }),
  useDroppable: () => ({ ref: vi.fn() }),
}));

function getColumn(label: string) {
  const heading = screen.getByText(label);
  const column = heading.parentElement?.parentElement?.parentElement;

  if (!column) {
    throw new Error(`Column "${label}" not found`);
  }

  return column as HTMLElement;
}

describe("KanbanBoard", () => {
  it("renders the expected columns", () => {
    render(<KanbanBoard skills={[]} onSkillStatusChange={vi.fn()} />);

    expect(screen.getByText("Not Started")).toBeInTheDocument();
    expect(screen.getByText("Working On")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("places skills in the correct status column", () => {
    render(
      <KanbanBoard
        skills={[
          makeSkill({ id: 1, name: "Forward swizzles", status: "not_started" }),
          makeSkill({ id: 2, name: "Forward stroking", status: "working_on" }),
          makeSkill({ id: 3, name: "Two-foot spin", status: "completed" }),
        ]}
        onSkillStatusChange={vi.fn()}
      />,
    );

    expect(within(getColumn("Not Started")).getByText("Forward swizzles")).toBeInTheDocument();
    expect(within(getColumn("Working On")).getByText("Forward stroking")).toBeInTheDocument();
    expect(within(getColumn("Completed")).getByText("Two-foot spin")).toBeInTheDocument();
  });
});

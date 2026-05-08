import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { KanbanBoard } from "@/components/kanban-board";
import { makeSkill } from "@/test-utils/fixtures";

const dndMocks = vi.hoisted(() => ({
  isSortable: vi.fn(),
  monitor: undefined as
    | {
        onDragStart: () => void;
        onDragOver: (event: {
          operation: {
            source?: { id: number };
            target?: { id: string | number; group?: string };
          };
        }) => void;
      }
    | undefined,
}));

vi.mock("@/lib/supabase", async () => {
  const { createMockSupabase } = await import("@/test-utils/mock-supabase");
  return { supabase: createMockSupabase().supabase };
});

vi.mock("@dnd-kit/react/sortable", () => ({
  useSortable: () => ({ ref: vi.fn(), isDragSource: false }),
  isSortable: dndMocks.isSortable,
}));

vi.mock("@dnd-kit/react", () => ({
  DragDropProvider: ({
    children,
    onDragStart,
    onDragEnd,
  }: {
    children: React.ReactNode;
    onDragStart: (event: { operation: { source?: { id: number } } }) => void;
    onDragEnd: (event: {
      operation: {
        source?: { id: number };
        target?: { id: string; group?: string };
      };
    }) => void;
  }) => (
    <div>
      {children}
      <button
        type="button"
        onClick={() =>
          onDragStart({
            operation: {
              source: { id: 1 },
            },
          })
        }
      >
        Start drag
      </button>
      <button
        type="button"
        onClick={() =>
          onDragEnd({
            operation: {
              source: { id: 1 },
              target: { id: "completed" },
            },
          })
        }
      >
        Complete drag
      </button>
      <button
        type="button"
        onClick={() =>
          onDragEnd({
            operation: {
              source: { id: 1 },
              target: { id: "not_started" },
            },
          })
        }
      >
        Same column drag
      </button>
      <button
        type="button"
        onClick={() =>
          onDragEnd({
            operation: {
              source: { id: 1 },
              target: { id: "2", group: "completed" },
            },
          })
        }
      >
        Sortable drag
      </button>
      <button
        type="button"
        onClick={() =>
          onDragEnd({
            operation: {
              source: { id: 99 },
              target: { id: "completed" },
            },
          })
        }
      >
        Unknown skill drag
      </button>
      <button
        type="button"
        onClick={() =>
          onDragEnd({
            operation: {
              source: { id: 1 },
            },
          })
        }
      >
        Incomplete drag
      </button>
    </div>
  ),
  DragOverlay: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useDragDropMonitor: vi.fn((handlers) => {
    dndMocks.monitor = handlers;
  }),
  useDraggable: () => ({ ref: vi.fn(), isDragSource: false }),
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
  beforeEach(() => {
    dndMocks.isSortable.mockImplementation((target: { group?: string }) =>
      Boolean(target.group),
    );
    dndMocks.monitor = undefined;
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the expected columns", () => {
    render(
      <KanbanBoard
        skills={[]}
        track="basic"
        level={1}
        onSkillStatusChange={vi.fn()}
      />,
    );

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
        track="basic"
        level={1}
        onSkillStatusChange={vi.fn()}
      />,
    );

    expect(
      within(getColumn("Not Started")).getByText("Forward swizzles"),
    ).toBeInTheDocument();
    expect(
      within(getColumn("Working On")).getByText("Forward stroking"),
    ).toBeInTheDocument();
    expect(
      within(getColumn("Completed")).getByText("Two-foot spin"),
    ).toBeInTheDocument();
  });

  it("calls the status change handler when a skill is dropped onto a column", async () => {
    const user = userEvent.setup();
    const onSkillStatusChange = vi.fn().mockResolvedValue(true);

    render(
      <KanbanBoard
        skills={[makeSkill({ id: 1, name: "Forward swizzles" })]}
        track="basic"
        level={1}
        onSkillStatusChange={onSkillStatusChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Complete drag" }));

    await waitFor(() =>
      expect(onSkillStatusChange).toHaveBeenCalledWith(1, "completed"),
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "spiral-skill-order-basic-1",
      "[1]",
    );
  });

  it("does not save order when a status update fails", async () => {
    const user = userEvent.setup();
    const onSkillStatusChange = vi.fn().mockResolvedValue(false);

    render(
      <KanbanBoard
        skills={[makeSkill({ id: 1, name: "Forward swizzles" })]}
        track="basic"
        level={1}
        onSkillStatusChange={onSkillStatusChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Complete drag" }));

    await waitFor(() =>
      expect(onSkillStatusChange).toHaveBeenCalledWith(1, "completed"),
    );
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it("does not save order when a status update throws", async () => {
    const user = userEvent.setup();
    const onSkillStatusChange = vi.fn().mockRejectedValue(new Error("Nope"));

    render(
      <KanbanBoard
        skills={[makeSkill({ id: 1, name: "Forward swizzles" })]}
        track="basic"
        level={1}
        onSkillStatusChange={onSkillStatusChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Complete drag" }));

    await waitFor(() =>
      expect(onSkillStatusChange).toHaveBeenCalledWith(1, "completed"),
    );
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it("saves same-column ordering without calling the status API", async () => {
    const user = userEvent.setup();
    const onSkillStatusChange = vi.fn();

    render(
      <KanbanBoard
        skills={[makeSkill({ id: 1, name: "Forward swizzles" })]}
        track="basic"
        level={1}
        onSkillStatusChange={onSkillStatusChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Same column drag" }));

    expect(onSkillStatusChange).not.toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "spiral-skill-order-basic-1",
      "[1]",
    );
  });

  it("uses sortable target groups for final status", async () => {
    const user = userEvent.setup();
    const onSkillStatusChange = vi.fn().mockResolvedValue(true);

    render(
      <KanbanBoard
        skills={[
          makeSkill({ id: 1, name: "Forward swizzles" }),
          makeSkill({ id: 2, name: "Forward stroking" }),
        ]}
        track="basic"
        level={1}
        onSkillStatusChange={onSkillStatusChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Sortable drag" }));

    await waitFor(() =>
      expect(onSkillStatusChange).toHaveBeenCalledWith(1, "completed"),
    );
  });

  it("ignores drops for skills that are no longer present", async () => {
    const user = userEvent.setup();
    const onSkillStatusChange = vi.fn();

    render(
      <KanbanBoard
        skills={[makeSkill({ id: 1, name: "Forward swizzles" })]}
        track="basic"
        level={1}
        onSkillStatusChange={onSkillStatusChange}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Unknown skill drag" }),
    );

    expect(onSkillStatusChange).not.toHaveBeenCalled();
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it("ignores drag events without a drop target", async () => {
    const user = userEvent.setup();
    const onSkillStatusChange = vi.fn();

    render(
      <KanbanBoard
        skills={[makeSkill({ id: 1, name: "Forward swizzles" })]}
        track="basic"
        level={1}
        onSkillStatusChange={onSkillStatusChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Incomplete drag" }));

    expect(onSkillStatusChange).not.toHaveBeenCalled();
  });

  it("moves a card locally while dragging over an empty column", () => {
    render(
      <KanbanBoard
        skills={[makeSkill({ id: 1, name: "Forward swizzles" })]}
        track="basic"
        level={1}
        onSkillStatusChange={vi.fn()}
      />,
    );

    act(() => {
      dndMocks.monitor?.onDragOver({
        operation: {
          source: { id: 1 },
          target: { id: "completed" },
        },
      });
    });

    expect(
      within(getColumn("Completed")).getByText("Forward swizzles"),
    ).toBeInTheDocument();
  });

  it("moves a card locally while dragging over a sortable card", () => {
    render(
      <KanbanBoard
        skills={[
          makeSkill({ id: 1, name: "Forward swizzles" }),
          makeSkill({ id: 2, name: "Forward stroking", status: "completed" }),
        ]}
        track="basic"
        level={1}
        onSkillStatusChange={vi.fn()}
      />,
    );

    act(() => {
      dndMocks.monitor?.onDragOver({
        operation: {
          source: { id: 1 },
          target: { id: 2, group: "completed" },
        },
      });
    });

    expect(
      within(getColumn("Completed")).getByText("Forward swizzles"),
    ).toBeInTheDocument();
  });
});

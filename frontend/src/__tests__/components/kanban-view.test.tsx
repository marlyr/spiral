import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { KanbanView } from "@/components/kanban-view";
import { Dashboard } from "@/components/dashboard";
import { server } from "@/test-utils/msw-server";
import { renderWithProviders } from "@/test-utils/render";

vi.mock("@/lib/supabase", async () => {
  const { createMockSupabase } = await import("@/test-utils/mock-supabase");
  return { supabase: createMockSupabase().supabase };
});

vi.mock("@dnd-kit/react/sortable", () => ({
  useSortable: () => ({ ref: vi.fn(), isDragSource: false }),
  isSortable: () => false,
}));

vi.mock("@dnd-kit/react", () => ({
  DragDropProvider: ({
    children,
    onDragEnd,
  }: {
    children: React.ReactNode;
    onDragEnd?: (event: {
      operation: {
        source?: { id: number };
        target?: { id: string };
      };
    }) => void;
  }) => (
    <div>
      {children}
      <button
        type="button"
        onClick={() =>
          onDragEnd?.({
            operation: {
              source: { id: 1 },
              target: { id: "completed" },
            },
          })
        }
      >
        Complete drag
      </button>
    </div>
  ),
  DragOverlay: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useDragDropMonitor: vi.fn(),
  useDraggable: () => ({ ref: vi.fn(), isDragSource: false }),
  useDroppable: () => ({ ref: vi.fn() }),
}));

const defaultProps = {
  openLevels: new Set([1, 2, 3, 4, 5, 6]),
  onLevelToggle: vi.fn(),
};

describe("KanbanView", () => {
  it("renders skills returned by the API", async () => {
    render(<KanbanView {...defaultProps} />);

    expect(await screen.findByText("Forward swizzles")).toBeInTheDocument();
    expect(screen.getByText("Forward stroking")).toBeInTheDocument();
  });

  it("renders empty level counts when no skills are returned", async () => {
    server.use(
      http.get("http://localhost:3000/skills/", () => HttpResponse.json([])),
    );

    render(<KanbanView {...defaultProps} />);

    expect(await screen.findAllByText("(0)")).toHaveLength(6);
    expect(screen.queryByText("Forward swizzles")).not.toBeInTheDocument();
  });

  it("shows an error state when the fetch fails", async () => {
    server.use(
      http.get("http://localhost:3000/skills/", () =>
        HttpResponse.json({ message: "Failed" }, { status: 500 }),
      ),
    );

    render(<KanbanView {...defaultProps} />);

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
  });

  it("updates skill status through the API after a completed drag", async () => {
    const user = userEvent.setup();
    const patchHandler = vi.fn(() =>
      HttpResponse.json({ id: 1, status: "completed" }),
    );
    server.use(http.patch("http://localhost:3000/skills/:id", patchHandler));

    render(<KanbanView {...defaultProps} />);

    expect(await screen.findByText("Forward swizzles")).toBeInTheDocument();

    await user.click(
      screen.getAllByRole("button", { name: "Complete drag" })[0],
    );

    expect(patchHandler).toHaveBeenCalled();
  });

  it("rolls back status when the status API fails", async () => {
    const user = userEvent.setup();
    server.use(
      http.patch("http://localhost:3000/skills/:id", () =>
        HttpResponse.json({ message: "Failed" }, { status: 500 }),
      ),
    );

    render(<KanbanView {...defaultProps} />);

    expect(await screen.findByText("Forward swizzles")).toBeInTheDocument();

    await user.click(
      screen.getAllByRole("button", { name: "Complete drag" })[0],
    );

    expect(await screen.findByText("Forward swizzles")).toBeInTheDocument();
  });

  it("toggles all levels between collapsed and expanded", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Dashboard />);

    expect(await screen.findByText("Forward swizzles")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Collapse All" }));

    expect(
      screen.getByRole("button", { name: "Expand All" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Forward swizzles")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Expand All" }));

    expect(await screen.findByText("Forward swizzles")).toBeInTheDocument();
  });
});

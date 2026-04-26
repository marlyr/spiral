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

vi.mock("@dnd-kit/react", () => ({
  DragDropProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useDraggable: () => ({ ref: vi.fn() }),
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

import { useState } from "react";
import { KanbanView } from "@/components/kanban-view";
import { Navbar } from "@/components/navbar";

const levels = [1, 2, 3, 4, 5, 6];

export function Dashboard() {
  const [openLevels, setOpenLevels] = useState(new Set(levels));

  const toggleLevel = (isOpen: boolean, level: number) => {
    setOpenLevels((prev) => {
      const next = new Set(prev);
      if (isOpen) next.add(level);
      else next.delete(level);
      return next;
    });
  };

  const toggleAll = () => {
    setOpenLevels(openLevels.size === 0 ? new Set(levels) : new Set<number>());
  };

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto px-6 pt-4 flex items-center">
        <div className="flex-1" />
        <Navbar />
        <div className="flex-1 flex justify-end">
          <button
            onClick={toggleAll}
            className="px-4 py-1.5 rounded-full border border-border text-[12px] text-muted-foreground bg-card hover:bg-muted transition-all"
          >
            {openLevels.size === 0 ? "Expand All" : "Collapse All"}
          </button>
        </div>
      </div>
      <KanbanView openLevels={openLevels} onLevelToggle={toggleLevel} />
    </div>
  );
}

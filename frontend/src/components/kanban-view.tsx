import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import type { UserSkill, SkillStatus } from "@/types";
import { KanbanBoard } from "@/components/kanban-board";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function KanbanView() {
  const levels = [1, 2, 3, 4, 5, 6];
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [fetchError, setFetchError] = useState(false);
  const [openLevels, setOpenLevels] = useState(new Set(levels));

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get("/skills/");
        console.log(response);
        setSkills(response.data);
      } catch (error) {
        console.log(error);
        setFetchError(true);
        return;
      }
    })();
  }, []);

  const updateSkillStatus = async (skillId: number, newStatus: SkillStatus) => {
    const oldSkills = skills;
    setSkills((prevSkills) =>
      prevSkills.map((s) =>
        s.id === skillId ? { ...s, status: newStatus } : s,
      ),
    );
    try {
      await api.patch(`/skills/${skillId}`, { status: newStatus });
    } catch (error) {
      setSkills(oldSkills);
      console.error("Failed to update skill status: ", error);
      return;
    }
  };

  const toggleLevel = (isOpen: boolean, level: number) => {
    setOpenLevels((prevOpenLevels) => {
      const next = new Set(prevOpenLevels);
      if (isOpen) next.add(level);
      else next.delete(level);
      return next;
    });
  };

  const toggleAll = () => {
    const allCollapsed = openLevels.size === 0;
    if (allCollapsed) {
      setOpenLevels(new Set(levels));
    } else setOpenLevels(new Set<number>());
  };

  return (
    <>
      {fetchError && <h2>Something went wrong</h2>}
      <div className="max-w-5xl mx-auto px-6">
        <button
          onClick={toggleAll}
          className="block ml-auto mb-4 px-4 py-1.5 rounded-full border border-border text-[12px] text-muted-foreground bg-card hover:bg-muted transition-all"
        >
          {openLevels.size === 0 ? "Expand All" : "Collapse All"}
        </button>
        {levels.map((level) => (
          <Collapsible
            key={level}
            className="rounded-xl border border-border mb-3 overflow-hidden shadow-md bg-card"
            open={openLevels.has(level)}
            onOpenChange={(isOpen) => toggleLevel(isOpen, level)}
          >
            <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 bg-card border-b border-border hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--text2)]">
                  Level {level}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  ({skills.filter((s) => s.level === level).length})
                </span>
              </div>
              <ChevronRight
                className={`w-4 h-4 text-muted-foreground transition-transform ${openLevels.has(level) ? "rotate-90" : ""}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 bg-card">
                <KanbanBoard
                  key={level}
                  skills={skills.filter((s) => s.level === level)}
                  onSkillStatusChange={updateSkillStatus}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </>
  );
}

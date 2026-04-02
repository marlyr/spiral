import { ChevronRight } from "lucide-react";
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
      <div>
        <button onClick={toggleAll}>
          {openLevels.size === 0 ? "Expand All" : "Collapse All"}
        </button>
        {levels.map((level) => (
          <Collapsible
            className="rounded-md data-[state=open]:bg-muted"
            open={openLevels.has(level)}
            onOpenChange={(isOpen) => toggleLevel(isOpen, level)}
          >
            <CollapsibleTrigger className="flex items-center">
              <h2>Level {level}</h2>
              <ChevronRight
                className={openLevels.has(level) ? "rotate-90" : ""}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <KanbanBoard
                key={level}
                skills={skills.filter((s) => s.level === level)}
                onSkillStatusChange={updateSkillStatus}
              />
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </>
  );
}

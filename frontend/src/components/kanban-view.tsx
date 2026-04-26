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

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-1.5 bg-background border border-border rounded-lg px-3 py-[10px]">
      <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
      <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
      <div className="h-4 bg-muted rounded-full animate-pulse w-14 mt-0.5" />
    </div>
  );
}

function SkeletonColumn() {
  return (
    <div
      className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3"
      style={{ borderTopWidth: "2px", borderTopColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-[6px] h-[6px] rounded-full bg-muted animate-pulse" />
          <div className="h-2.5 bg-muted rounded animate-pulse w-20" />
        </div>
        <div className="h-2.5 bg-muted rounded animate-pulse w-3" />
      </div>
      <div className="flex flex-col gap-2">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

function SkeletonLevel() {
  return (
    <div className="rounded-xl border border-border mb-3 overflow-hidden shadow-md bg-card">
      <div className="w-full flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="h-2.5 bg-muted rounded animate-pulse w-14" />
        <div className="w-4 h-4 bg-muted rounded animate-pulse" />
      </div>
      <div className="p-3 bg-card">
        <div className="grid grid-cols-3 gap-4">
          <SkeletonColumn />
          <SkeletonColumn />
          <SkeletonColumn />
        </div>
      </div>
    </div>
  );
}

export function KanbanView({
  openLevels,
  onLevelToggle,
}: {
  openLevels: Set<number>;
  onLevelToggle: (isOpen: boolean, level: number) => void;
}) {
  const levels = [1, 2, 3, 4, 5, 6];
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get("/skills/");
        console.log(response);
        if (!Array.isArray(response.data)) {
          setFetchError(true);
          return;
        }
        setSkills(response.data);
      } catch (error) {
        console.log(error);
        setFetchError(true);
      } finally {
        setIsLoading(false);
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

  return (
    <>
      {fetchError && <h2>Something went wrong</h2>}
      <div className="max-w-5xl mx-auto px-6 mt-4">
        {isLoading ? (
          levels.map((level) => <SkeletonLevel key={level} />)
        ) : (
          <>
            {levels.map((level) => (
              <Collapsible
                key={level}
                className="rounded-xl border border-border mb-3 overflow-hidden shadow-md bg-card"
                open={openLevels.has(level)}
                onOpenChange={(isOpen) => onLevelToggle(isOpen, level)}
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
          </>
        )}
      </div>
    </>
  );
}

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
    <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between bg-muted">
        <div className="flex items-center gap-2">
          <div className="w-[13px] h-[13px] rounded-sm bg-muted-foreground/20 animate-pulse" />
          <div className="h-2.5 bg-muted-foreground/20 rounded animate-pulse w-20" />
        </div>
        <div className="h-5 w-6 bg-muted-foreground/20 rounded-full animate-pulse" />
      </div>
      <div className="flex flex-col gap-2 p-4">
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
        if (!Array.isArray(response.data)) {
          setFetchError(true);
          return;
        }
        setSkills(response.data);
      } catch {
        setFetchError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const updateSkillStatus = async (skillId: number, newStatus: SkillStatus) => {
    const originalStatus = skills.find((s) => s.id === skillId)?.status;
    setSkills((prevSkills) =>
      prevSkills.map((s) =>
        s.id === skillId ? { ...s, status: newStatus } : s,
      ),
    );
    try {
      await api.patch(`/skills/${skillId}`, { status: newStatus });
    } catch (error) {
      if (originalStatus !== undefined) {
        setSkills((prev) =>
          prev.map((s) =>
            s.id === skillId ? { ...s, status: originalStatus } : s,
          ),
        );
      }
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
            {levels.map((level) => {
              const levelSkills = skills.filter((s) => s.level === level);
              const track =
                levelSkills[0]?.track ?? skills[0]?.track ?? "unknown";
              const pct =
                levelSkills.length > 0
                  ? (levelSkills.filter((s) => s.status === "completed")
                      .length /
                      levelSkills.length) *
                    100
                  : 0;
              return (
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
                        ({levelSkills.length})
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-[width] duration-500 ease-out"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: "var(--sage)",
                          }}
                        />
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-muted-foreground transition-transform ${openLevels.has(level) ? "rotate-90" : ""}`}
                      />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-3 bg-card">
                      <KanbanBoard
                        key={`${track}-${level}`}
                        track={track}
                        level={level}
                        skills={levelSkills}
                        onSkillStatusChange={updateSkillStatus}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}

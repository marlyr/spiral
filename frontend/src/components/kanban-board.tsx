import type { Skill, SkillStatus } from "@/types";
import { KanbanColumn } from "@/components/kanban-column";

export function KanbanBoard({
  skills,
  level,
  onSkillStatusChange,
}: {
  skills: Skill[];
  level: number;
  onSkillStatusChange: (
    skillId: number,
    newStatus: SkillStatus,
  ) => Promise<void>;
}) {
  const notStarted = skills.filter((skill) => skill.status == "not_started");
  const workingOn = skills.filter((skill) => skill.status == "working_on");
  const completed = skills.filter((skill) => skill.status == "completed");

  return (
    <div className="flex flex-col gap-2">
      <h2>Level {level}</h2>
      <div className="grid grid-cols-3 gap-4">
        <KanbanColumn
          skills={notStarted}
          status="not_started"
          onSkillStatusChange={onSkillStatusChange}
        />
        <KanbanColumn
          skills={workingOn}
          status="working_on"
          onSkillStatusChange={onSkillStatusChange}
        />
        <KanbanColumn
          skills={completed}
          status="completed"
          onSkillStatusChange={onSkillStatusChange}
        />
      </div>
    </div>
  );
}

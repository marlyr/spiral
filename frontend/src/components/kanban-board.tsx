import type { UserSkill, SkillStatus } from "@/types";
import { KanbanColumn } from "@/components/kanban-column";

import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";

export function KanbanBoard({
  skills,
  onSkillStatusChange,
}: {
  skills: UserSkill[];
  onSkillStatusChange: (
    skillId: number,
    newStatus: SkillStatus,
  ) => Promise<void>;
}) {
  const notStarted = skills.filter((skill) => skill.status == "not_started");
  const workingOn = skills.filter((skill) => skill.status == "working_on");
  const completed = skills.filter((skill) => skill.status == "completed");

  const handleDragEnd: DragEndEvent = (event) => {
    if (!event.operation.source || !event.operation.target) return;
    const skillId = event.operation.source.id as number;
    const newStatus = event.operation.target.id as SkillStatus;
    onSkillStatusChange(skillId, newStatus);
  };

  return (
    <div className="flex flex-col gap-2">
      <DragDropProvider onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          <KanbanColumn skills={notStarted} status="not_started" />
          <KanbanColumn skills={workingOn} status="working_on" />
          <KanbanColumn skills={completed} status="completed" />
        </div>
      </DragDropProvider>
    </div>
  );
}

import type { UserSkill, SkillStatus } from "@/types";
import { SkillCard } from "@/components/skill-card";

import { useDroppable } from "@dnd-kit/react";

export function KanbanColumn({
  skills,
  status,
}: {
  skills: UserSkill[];
  status: SkillStatus;
}) {
  const statusLabels = {
    not_started: "Not Started",
    working_on: "Working On",
    completed: "Completed",
  };

  const { ref } = useDroppable({ id: status });

  return (
    <div ref={ref} className="flex flex-col bg-muted p-4 gap-2">
      <h2>{statusLabels[status]}</h2>
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  );
}

import type { UserSkill, SkillStatus } from "@/types";
import { SkillCard } from "@/components/skill-card";

export function KanbanColumn({
  skills,
  status,
  onSkillStatusChange,
}: {
  skills: UserSkill[];
  status: SkillStatus;
  onSkillStatusChange: (
    skillId: number,
    newStatus: SkillStatus,
  ) => Promise<void>;
}) {
  const statusLabels = {
    not_started: "Not Started",
    working_on: "Working On",
    completed: "Completed",
  };

  return (
    <div className="flex flex-col bg-muted p-4 gap-2">
      <h2>{statusLabels[status]}</h2>
      {skills.map((skill) => (
        <SkillCard
          key={skill.id}
          skill={skill}
          onSkillStatusChange={onSkillStatusChange}
        />
      ))}
    </div>
  );
}

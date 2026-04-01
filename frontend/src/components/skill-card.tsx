import type { UserSkill, SkillStatus } from "@/types";

export function SkillCard({
  skill,
  onSkillStatusChange,
}: {
  skill: UserSkill;
  onSkillStatusChange: (
    skillId: number,
    newStatus: SkillStatus,
  ) => Promise<void>;
}) {
  return (
    <div className="w-full bg-card rounded-md py-2 px-4 flex items-start">
      <button onClick={() => onSkillStatusChange(skill.id, "not_started")}>
        Mark as not started
      </button>
      <button onClick={() => onSkillStatusChange(skill.id, "working_on")}>
        Mark as working on
      </button>
      <button onClick={() => onSkillStatusChange(skill.id, "completed")}>
        Mark as completed
      </button>
      <p className="line-clamp-3">{skill.name}</p>
    </div>
  );
}

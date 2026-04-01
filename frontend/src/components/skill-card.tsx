import type { Skill, SkillStatus } from "@/types";

export function SkillCard({
  skill,
  onSkillStatusChange,
}: {
  skill: Skill;
  onSkillStatusChange: (
    skillId: number,
    newStatus: SkillStatus,
  ) => Promise<void>;
}) {
  return (
    <div className="w-full bg-card rounded-md py-2 px-4 flex items-start">
      <p className="line-clamp-3">{skill.name}</p>
    </div>
  );
}

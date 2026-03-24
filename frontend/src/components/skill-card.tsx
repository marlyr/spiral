import type { Skill } from "@/types";

export function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div className="w-full bg-card rounded-md py-2 px-4 flex items-start">
      <p className="line-clamp-3">{skill.name}</p>
    </div>
  )
}

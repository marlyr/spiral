import type { Skill } from "@/types";

export function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div className="w-full h-12 bg-card rounded-md px-4 flex items-center">
      <p>{skill.skill.name}</p>
    </div>
  )
}

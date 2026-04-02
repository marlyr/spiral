import type { UserSkill } from "@/types";

import { useDraggable } from "@dnd-kit/react";

export function SkillCard({ skill }: { skill: UserSkill }) {
  const { ref } = useDraggable({ id: skill.id });
  return (
    <div
      ref={ref}
      className="w-full bg-card rounded-md py-2 px-4 flex items-start"
    >
      <p className="line-clamp-3">{skill.name}</p>
    </div>
  );
}

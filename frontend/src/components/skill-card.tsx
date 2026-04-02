import type { UserSkill } from "@/types";

import { useDraggable } from "@dnd-kit/react";

export function SkillCard({ skill }: { skill: UserSkill }) {
  const { ref } = useDraggable({ id: skill.id });
  return (
    <div
      ref={ref}
      className="bg-card border border-border rounded-lg px-3 py-[10px] cursor-pointer transition-all hover:shadow-md hover:-translate-y-px hover:border-[var(--border-mid)] flex items-start"
    >
      <p className="text-[13px] font-medium text-foreground line-clamp-3">{skill.name}</p>
    </div>
  );
}

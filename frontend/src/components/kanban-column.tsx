import type { UserSkill, SkillStatus } from "@/types";
import { SkillCard } from "@/components/skill-card";

import { useDroppable } from "@dnd-kit/react";

const statusConfig: Record<SkillStatus, { label: string; dotColor: string }> = {
  not_started: { label: "Not Started", dotColor: "bg-[#e0dbd2]" },
  working_on: { label: "Working On", dotColor: "bg-[#7c85c8]" },
  completed: { label: "Completed", dotColor: "bg-[#6b8f74]" },
};

export function KanbanColumn({
  skills,
  status,
}: {
  skills: UserSkill[];
  status: SkillStatus;
}) {
  const { ref } = useDroppable({ id: status });
  const { label, dotColor } = statusConfig[status];

  return (
    <div
      ref={ref}
      className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${dotColor}`} />
          <span className="text-[11px] font-medium tracking-widest uppercase text-[var(--peri-dim)]">
            {label}
          </span>
        </div>
        <span className="text-[11px] text-[var(--border-mid)]">{skills.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
    </div>
  );
}

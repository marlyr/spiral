import type { UserSkill, SkillStatus } from "@/types";
import { SkillCard } from "@/components/skill-card";
import { statusStyles as statusConfig } from "@/lib/status-styles";

import { useDroppable } from "@dnd-kit/react";

export function KanbanColumn({
  skills,
  status,
  recentlyDropped,
}: {
  skills: UserSkill[];
  status: SkillStatus;
  recentlyDropped?: number | null;
}) {
  const { ref } = useDroppable({ id: status });
  const { label, dotColor } = statusConfig[status];

  return (
    <div
      ref={ref}
      className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3"
      style={{
        borderTopWidth: "2px",
        borderTopColor: statusConfig[status].color,
      }}
    >
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span
            className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${dotColor}`}
          />
          <span className="text-[11px] font-medium tracking-widest uppercase text-[var(--peri-dim)]">
            {label}
          </span>
        </div>
        <span className="text-[11px] text-[var(--border-mid)]">
          {skills.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {skills.map((skill, i) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            index={i}
            isRecentlyDropped={recentlyDropped === skill.id}
          />
        ))}
      </div>
    </div>
  );
}

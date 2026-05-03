import type { UserSkill, SkillStatus } from "@/types";
import { SkillCard } from "@/components/skill-card";
import { statusStyles as statusConfig } from "@/lib/status-styles";
import { useDroppable } from "@dnd-kit/react";
import { Clock, Zap, CheckCircle2 } from "lucide-react";

const statusIcons = {
  not_started: Clock,
  working_on: Zap,
  completed: CheckCircle2,
};

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
  const { label, bg, color } = statusConfig[status];
  const Icon = statusIcons[status];

  return (
    <div
      ref={ref}
      className="bg-card border border-border rounded-xl flex flex-col overflow-hidden"
    >
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          backgroundColor: bg,
          borderBottom: `1px solid ${color}30`,
        }}
      >
        <div className="flex items-center gap-2">
          <Icon size={13} style={{ color }} strokeWidth={2.5} />
          <span
            className="text-[12px] font-bold tracking-wide uppercase whitespace-nowrap"
            style={{ color }}
          >
            {label}
          </span>
        </div>
        <span
          className="text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${color}20`,
            color,
          }}
        >
          {skills.length}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-4">
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

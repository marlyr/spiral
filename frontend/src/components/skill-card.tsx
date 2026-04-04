import type { UserSkill } from "@/types";
import { DialogTrigger } from "./ui/dialog";

import { useDraggable } from "@dnd-kit/react";
import { CategoryBadge } from "./category-badge";
import { Dialog } from "./ui/dialog";
import { SkillDetailModal } from "./skill-detail-modal";

export function SkillCard({ skill }: { skill: UserSkill }) {
  const { ref } = useDraggable({ id: skill.id });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          ref={ref}
          className="flex flex-col gap-1 bg-background border border-border rounded-lg px-3 py-[10px] cursor-pointer transition-all hover:shadow-md hover:-translate-y-px hover:border-[var(--border-mid)]"
        >
          <p className="text-[13px] font-medium text-foreground line-clamp-3">
            {skill.name}
          </p>
          <CategoryBadge category={skill.category} />
        </div>
      </DialogTrigger>
      <SkillDetailModal skill={skill} />
    </Dialog>
  );
}

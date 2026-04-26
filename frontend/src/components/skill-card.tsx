import { useEffect, useState } from "react";
import type { UserSkill } from "@/types";
import { DialogTrigger } from "./ui/dialog";

import { useSortable } from "@dnd-kit/react/sortable";
import { CategoryBadge } from "./category-badge";
import { Dialog } from "./ui/dialog";
import { SkillDetailModal } from "./skill-detail-modal";

export function SkillCard({
  skill,
  index,
  isRecentlyDropped,
}: {
  skill: UserSkill;
  index: number;
  isRecentlyDropped?: boolean;
}) {
  const { ref, isDragSource } = useSortable({
    id: skill.id,
    index,
    group: skill.status,
    // OptimisticSortingPlugin physically moves DOM nodes during drag,
    // which desynchronises React's tree and causes a removeChild crash.
    plugins: [],
  });
  const [entering, setEntering] = useState(isRecentlyDropped ?? false);

  useEffect(() => {
    if (!entering) return;
    const id = setTimeout(() => setEntering(false), 50);
    return () => clearTimeout(id);
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          ref={ref}
          className={`flex flex-col gap-1 bg-background rounded-lg px-3 py-[10px] cursor-pointer ${
            isDragSource
              ? ""
              : "border border-border hover:border-[var(--border-mid)] hover:shadow-md hover:-translate-y-px"
          }`}
          style={{
            border: isDragSource ? "1.5px dashed var(--border)" : undefined,
            opacity: isDragSource ? 0.3 : 1,
            transform: entering ? "scale(0.9) translateY(4px)" : undefined,
            transition: isDragSource
              ? "none"
              : "transform 350ms cubic-bezier(0.34,1.56,0.64,1), opacity 220ms ease, border-color 150ms ease, box-shadow 150ms ease",
          }}
        >
          <p
            className="text-[13px] font-medium text-foreground line-clamp-3"
            style={{ visibility: isDragSource ? "hidden" : "visible" }}
          >
            {skill.name}
          </p>
          <div style={{ visibility: isDragSource ? "hidden" : "visible" }}>
            <CategoryBadge category={skill.category} />
          </div>
        </div>
      </DialogTrigger>
      <SkillDetailModal skill={skill} />
    </Dialog>
  );
}

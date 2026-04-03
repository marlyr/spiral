import type { SkillCategory } from "@/types";

const categoryStyles: Record<string, { bg: string; color: string }> = {
  jump: { bg: "#f6ede6", color: "#b8784e" },
  spin: { bg: "#e4eef8", color: "#4a7ab8" },
  edge: { bg: "#eaf2ec", color: "#6b8f74" },
  footwork: { bg: "#ede8f5", color: "#7a68a8" },
  foundation: { bg: "#f5e8e0", color: "#9a7060" },
};

export function CategoryBadge({ category }: { category: SkillCategory }) {
  const pill = categoryStyles[category];
  return (
    <span
      style={{ background: pill.bg, color: pill.color }}
      className="self-start capitalize text-[10px] font-medium px-[7px] py-[2px] rounded-sm tracking-[0.02em]"
    >
      {category}
    </span>
  );
}

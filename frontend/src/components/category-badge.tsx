import type { SkillCategory } from "@/types";
import { Badge } from "@/components/badge";

const categoryStyles: Record<string, { bg: string; color: string }> = {
  jump: { bg: "var(--badge-jump-bg)", color: "var(--badge-jump-color)" },
  spin: { bg: "var(--badge-spin-bg)", color: "var(--badge-spin-color)" },
  edge: { bg: "var(--badge-edge-bg)", color: "var(--badge-edge-color)" },
  footwork: { bg: "var(--badge-footwork-bg)", color: "var(--badge-footwork-color)" },
  foundation: { bg: "var(--badge-foundation-bg)", color: "var(--badge-foundation-color)" },
};

export function CategoryBadge({
  category,
  style,
}: {
  category: SkillCategory;
  style?: React.CSSProperties;
}) {
  return <Badge label={category} {...categoryStyles[category]} style={style} />;
}

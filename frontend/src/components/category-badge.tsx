import type { SkillCategory } from "@/types";
import { Badge } from "./badge";

const categoryStyles: Record<string, { bg: string; color: string }> = {
  jump: { bg: "#f6ede6", color: "#b8784e" },
  spin: { bg: "#e4eef8", color: "#4a7ab8" },
  edge: { bg: "#eaf2ec", color: "#6b8f74" },
  footwork: { bg: "#ede8f5", color: "#7a68a8" },
  foundation: { bg: "#f5e8e0", color: "#9a7060" },
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

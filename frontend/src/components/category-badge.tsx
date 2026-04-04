import type { SkillCategory } from "@/types";
import { Badge } from "@/components/badge";

const categoryStyles: Record<string, { bg: string; color: string }> = {
  jump: { bg: "#eeddd0", color: "#a0612e" },
  spin: { bg: "#d4e6f6", color: "#3a6aa8" },
  edge: { bg: "#d6ecdb", color: "#4d7a57" },
  footwork: { bg: "#e2d8f0", color: "#6550a0" },
  foundation: { bg: "#edd8cc", color: "#7a5040" },
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

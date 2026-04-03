import { statusStyles as statusConfig } from "@/lib/status-styles";
import { Badge } from "@/components/badge";
import type { SkillStatus } from "@/types";

export function StatusBadge({
  status,
  style,
}: {
  status: SkillStatus;
  style?: React.CSSProperties;
}) {
  const { label, bg, color } = statusConfig[status];
  return <Badge label={label} bg={bg} color={color} style={style} />;
}

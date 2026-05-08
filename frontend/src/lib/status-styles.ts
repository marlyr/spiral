import type { SkillStatus } from "@/types";
import { Clock, Zap, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const statusStyles: Record<
  SkillStatus,
  { label: string; bg: string; color: string; icon: LucideIcon }
> = {
  not_started: {
    label: "Not Started",
    bg: "var(--badge-not-started-bg)",
    color: "var(--badge-not-started-color)",
    icon: Clock,
  },
  working_on: {
    label: "Working On",
    bg: "var(--badge-working-on-bg)",
    color: "var(--badge-working-on-color)",
    icon: Zap,
  },
  completed: {
    label: "Completed",
    bg: "var(--badge-completed-bg)",
    color: "var(--badge-completed-color)",
    icon: CheckCircle2,
  },
};

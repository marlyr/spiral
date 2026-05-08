import type { SkillStatus } from "@/types";

export const statusStyles: Record<
  SkillStatus,
  { label: string; bg: string; color: string }
> = {
  not_started: {
    label: "Not Started",
    bg: "var(--badge-not-started-bg)",
    color: "var(--badge-not-started-color)",
  },
  working_on: {
    label: "Working On",
    bg: "var(--badge-working-on-bg)",
    color: "var(--badge-working-on-color)",
  },
  completed: {
    label: "Completed",
    bg: "var(--badge-completed-bg)",
    color: "var(--badge-completed-color)",
  },
};

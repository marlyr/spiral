import type { SkillStatus } from "@/types";

export const statusStyles: Record<
  SkillStatus,
  { label: string; dotColor: string; bg: string; color: string }
> = {
  not_started: {
    label: "Not Started",
    dotColor: "bg-[#e0dbd2]",
    bg: "#f0ede8",
    color: "#8a8078",
  },
  working_on: {
    label: "Working On",
    dotColor: "bg-[#7c85c8]",
    bg: "#eaecf8",
    color: "#5a63a8",
  },
  completed: {
    label: "Completed",
    dotColor: "bg-[#6b8f74]",
    bg: "#eaf2ec",
    color: "#6b8f74",
  },
};

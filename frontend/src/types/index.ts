export type SkatingTrack = "basic" | "adult" | "pre_freeskate" | "freeskate";

export type SkillStatus = "not_started" | "working_on" | "completed";

export type SkillCategory =
  | "foundation"
  | "edge"
  | "footwork"
  | "spin"
  | "jump";

export interface User {
  id: string;
  email: string;
  active_track: string | null;
}

export type UserSkill = {
  status: SkillStatus;
  id: number;
  name: string;
  track: string;
  level: number;
  category: SkillCategory;
  bonus: boolean;
  notes: string | null;
};

export interface DiaryEntry {
  id: number;
  entry_name: string;
  category: string | null;
  text: string;
  date: string;
}


export type SkatingTrack = "basic" | "adult" | "pre_freeskate" | "freeskate";

export type SkillStatus = "not_started" | "working_on" | "completed";

export interface User {
    id: number
    email: string
    active_track: string | null
  };
  
export type Skill = {
  status: "not_started" | "working_on" | "completed";
  skill: {
    id: number;
    name: string;
    track: string;
    level: number;
    bonus: boolean;
  };
}

export interface DiaryEntry {
  id: number
  entry_name: string
  category: string | null
  text: string
  date: string
};


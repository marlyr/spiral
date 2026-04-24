import {
  Footprints,
  Medal,
  Orbit,
  PersonStanding,
  type LucideIcon,
} from "lucide-react";

import type { SkatingTrack } from "@/types";

export type TrackDetails = {
  track: SkatingTrack;
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
};

export const curriculumTracks: TrackDetails[] = [
  {
    track: "basic",
    title: "Basic Skills",
    description:
      "Start here with balance, stroking, stops, crossovers, and your first one-foot skills.",
    icon: Footprints,
    iconClassName: "bg-[var(--accent)] text-[var(--primary)]",
  },
  {
    track: "adult",
    title: "Adult",
    description:
      "The same fundamentals, reworked for adult beginners building confidence, strength, and control.",
    icon: PersonStanding,
    iconClassName: "bg-[var(--warm-bg)] text-[var(--warm)]",
  },
  {
    track: "pre_freeskate",
    title: "Pre-Freeskate",
    description:
      "The bridge into freestyle, where single jumps, spins, and stronger edge quality start to connect.",
    icon: Orbit,
    iconClassName: "bg-[#e2d8f0] text-[#6550a0]",
  },
  {
    track: "freeskate",
    title: "Freeskate",
    description:
      "Advanced progression focused on stronger jumps, spins, and the consistency to skate full programs.",
    icon: Medal,
    iconClassName: "bg-[#efe3c8] text-[#8f6428]",
  },
];

export const trackDetailsByTrack: Record<SkatingTrack, TrackDetails> = {
  basic: curriculumTracks[0],
  adult: curriculumTracks[1],
  pre_freeskate: curriculumTracks[2],
  freeskate: curriculumTracks[3],
};

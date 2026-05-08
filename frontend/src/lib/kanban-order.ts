import type { UserSkill } from "@/types";

export type OrderScope = {
  track: string;
  level: number;
};

const STORAGE_KEY = ({ track, level }: OrderScope) =>
  `spiral-skill-order-${track}-${level}`;

export function loadOrder(skills: UserSkill[], scope: OrderScope): UserSkill[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(scope));
    if (!raw) return skills;
    const ids: number[] = JSON.parse(raw);
    const byId = new Map(skills.map((s) => [s.id, s]));
    const ordered = ids.filter((id) => byId.has(id)).map((id) => byId.get(id)!);
    const savedSet = new Set(ids);
    const unseen = skills.filter((s) => !savedSet.has(s.id));
    return [...ordered, ...unseen];
  } catch {
    return skills;
  }
}

export function saveOrder(skills: UserSkill[], scope: OrderScope): void {
  try {
    localStorage.setItem(
      STORAGE_KEY(scope),
      JSON.stringify(skills.map((s) => s.id)),
    );
  } catch {
    // Storage quota exceeded — order just won't persist.
  }
}

export function syncWithParent(
  prev: UserSkill[],
  next: UserSkill[],
): UserSkill[] {
  const nextIds = new Set(next.map((s) => s.id));
  const prevIds = new Set(prev.map((s) => s.id));
  const updated = prev
    .filter((s) => nextIds.has(s.id))
    .map((s) => next.find((p) => p.id === s.id)!);
  const brandNew = next.filter((s) => !prevIds.has(s.id));
  return [...updated, ...brandNew];
}

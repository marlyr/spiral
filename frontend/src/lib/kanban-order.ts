import type { UserSkill } from "@/types";

const STORAGE_KEY = (level: number) => `spiral-skill-order-${level}`;

export function loadOrder(skills: UserSkill[], level: number): UserSkill[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(level));
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

export function saveOrder(skills: UserSkill[], level: number): void {
  try {
    localStorage.setItem(STORAGE_KEY(level), JSON.stringify(skills.map((s) => s.id)));
  } catch {
    // Storage quota exceeded — order just won't persist.
  }
}

export function syncWithParent(prev: UserSkill[], next: UserSkill[]): UserSkill[] {
  const nextIds = new Set(next.map((s) => s.id));
  const prevIds = new Set(prev.map((s) => s.id));
  const updated = prev
    .filter((s) => nextIds.has(s.id))
    .map((s) => next.find((p) => p.id === s.id)!);
  const brandNew = next.filter((s) => !prevIds.has(s.id));
  return [...updated, ...brandNew];
}

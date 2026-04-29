import { describe, expect, it, beforeEach } from "vitest";
import { loadOrder, saveOrder, syncWithParent } from "@/lib/kanban-order";
import { makeSkill } from "@/test-utils/fixtures";

describe("syncWithParent", () => {
  it("preserves local ordering when parent re-sends the same skills", () => {
    const prev = [
      makeSkill({ id: 2, name: "B" }),
      makeSkill({ id: 1, name: "A" }),
    ];
    const next = [
      makeSkill({ id: 1, name: "A" }),
      makeSkill({ id: 2, name: "B" }),
    ];
    const result = syncWithParent(prev, next);
    expect(result.map((s) => s.id)).toEqual([2, 1]);
  });

  it("removes skills that are no longer in parent", () => {
    const prev = [makeSkill({ id: 1 }), makeSkill({ id: 2 })];
    const next = [makeSkill({ id: 1 })];
    const result = syncWithParent(prev, next);
    expect(result.map((s) => s.id)).toEqual([1]);
  });

  it("appends brand-new skills from parent at the end", () => {
    const prev = [makeSkill({ id: 1 })];
    const next = [makeSkill({ id: 1 }), makeSkill({ id: 3 })];
    const result = syncWithParent(prev, next);
    expect(result.map((s) => s.id)).toEqual([1, 3]);
  });

  it("takes server field values (e.g. status) from parent", () => {
    const prev = [makeSkill({ id: 1, status: "working_on" })];
    const next = [makeSkill({ id: 1, status: "completed" })];
    const result = syncWithParent(prev, next);
    expect(result[0].status).toBe("completed");
  });
});

describe("loadOrder / saveOrder", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns skills unchanged when no saved order exists", () => {
    const skills = [makeSkill({ id: 1 }), makeSkill({ id: 2 })];
    expect(loadOrder(skills, 1)).toEqual(skills);
  });

  it("restores a previously saved order", () => {
    const skills = [makeSkill({ id: 1 }), makeSkill({ id: 2 }), makeSkill({ id: 3 })];
    saveOrder([makeSkill({ id: 3 }), makeSkill({ id: 1 }), makeSkill({ id: 2 })], 1);
    const result = loadOrder(skills, 1);
    expect(result.map((s) => s.id)).toEqual([3, 1, 2]);
  });

  it("appends skills absent from the saved order at the end", () => {
    const skills = [makeSkill({ id: 1 }), makeSkill({ id: 4 })];
    saveOrder([makeSkill({ id: 1 })], 1);
    const result = loadOrder(skills, 1);
    expect(result.map((s) => s.id)).toEqual([1, 4]);
  });

  it("ignores saved ids that no longer exist", () => {
    const skills = [makeSkill({ id: 2 })];
    saveOrder([makeSkill({ id: 99 }), makeSkill({ id: 2 })], 1);
    const result = loadOrder(skills, 1);
    expect(result.map((s) => s.id)).toEqual([2]);
  });

  it("uses separate storage keys per level", () => {
    const skillsL1 = [makeSkill({ id: 1 }), makeSkill({ id: 2 })];
    const skillsL2 = [makeSkill({ id: 3 }), makeSkill({ id: 4 })];
    saveOrder([makeSkill({ id: 2 }), makeSkill({ id: 1 })], 1);
    saveOrder([makeSkill({ id: 4 }), makeSkill({ id: 3 })], 2);
    expect(loadOrder(skillsL1, 1).map((s) => s.id)).toEqual([2, 1]);
    expect(loadOrder(skillsL2, 2).map((s) => s.id)).toEqual([4, 3]);
  });

  it("returns skills unchanged when stored JSON is corrupt", () => {
    localStorage.setItem("spiral-skill-order-1", "not-valid-json{{{");
    const skills = [makeSkill({ id: 1 })];
    expect(loadOrder(skills, 1)).toEqual(skills);
  });
});

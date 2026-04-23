import { HttpResponse, http } from "msw";
import type { UserSkill } from "@/types";

export const defaultSkills: UserSkill[] = [
  {
    id: 1,
    name: "Forward swizzles",
    track: "basic",
    level: 1,
    category: "foundation",
    bonus: false,
    notes: "Keep knees soft",
    status: "not_started",
  },
  {
    id: 2,
    name: "Forward stroking",
    track: "basic",
    level: 1,
    category: "edge",
    bonus: false,
    notes: null,
    status: "working_on",
  },
  {
    id: 3,
    name: "Two-foot spin",
    track: "basic",
    level: 2,
    category: "spin",
    bonus: false,
    notes: "Stay centered",
    status: "completed",
  },
];

export const handlers = [
  http.get("http://localhost:3000/users/profile", () =>
    HttpResponse.json({
      id: "user-1",
      email: "skater@example.com",
      active_track: "basic",
    }),
  ),
  http.patch("http://localhost:3000/users/track", async ({ request }) => {
    const body = (await request.json()) as { active_track?: string };

    return HttpResponse.json({
      active_track: body.active_track ?? "basic",
    });
  }),
  http.get("http://localhost:3000/skills/", () =>
    HttpResponse.json(defaultSkills),
  ),
  http.patch("http://localhost:3000/skills/:id", async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;

    return HttpResponse.json({
      id: Number(params.id),
      ...body,
    });
  }),
];

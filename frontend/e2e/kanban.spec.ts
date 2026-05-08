import { expect, test, type Locator, type Page } from "@playwright/test";

type SkillStatus = "not_started" | "working_on" | "completed";

interface Skill {
  id: number;
  name: string;
  track: string;
  level: number;
  category: string;
  bonus: boolean;
  notes: string | null;
  status: SkillStatus;
}

const userEmail = "skater@example.com";
const validPassword = "password123";

const defaultSkills: Skill[] = [
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

// Skills for tests that need multiple cards in the same column.
const multiCardSkills: Skill[] = [
  {
    id: 1,
    name: "Forward swizzles",
    track: "basic",
    level: 1,
    category: "foundation",
    bonus: false,
    notes: null,
    status: "not_started",
  },
  {
    id: 2,
    name: "Backward swizzles",
    track: "basic",
    level: 1,
    category: "foundation",
    bonus: false,
    notes: null,
    status: "not_started",
  },
  {
    id: 3,
    name: "Forward stroking",
    track: "basic",
    level: 1,
    category: "edge",
    bonus: false,
    notes: null,
    status: "working_on",
  },
];

async function mockApi(page: Page, initialSkills: Skill[] = defaultSkills) {
  let skills = initialSkills.map((s) => ({ ...s }));

  await page.route("**/users/profile", (route) =>
    route.fulfill({
      json: { id: "e2e-user-1", email: userEmail, active_track: "basic" },
    }),
  );

  await page.route("**/skills/**", async (route) => {
    if (route.request().method() === "GET") {
      return route.fulfill({ json: skills });
    }
    const id = Number(route.request().url().split("/").pop());
    const body = route.request().postDataJSON() as { status: SkillStatus };
    skills = skills.map((s) =>
      s.id === id ? { ...s, status: body.status } : s,
    );
    return route.fulfill({ json: { id, status: body.status } });
  });
}

async function loginToDashboard(page: Page) {
  await page.goto("/login");
  await page.getByRole("textbox", { name: "Email" }).fill(userEmail);
  await page.getByRole("textbox", { name: "Password" }).fill(validPassword);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  // Wait for skeleton to clear
  await expect(page.getByRole("button", { name: /Level 1/ })).toBeVisible();
}

// Get a kanban column by its label, scoped to a specific level (0-indexed).
function getColumn(page: Page, label: string, levelIndex = 0): Locator {
  return page
    .getByTestId("kanban-column")
    .filter({ hasText: label })
    .nth(levelIndex);
}

// Simulate a pointer-based drag compatible with dnd-kit's PointerSensor.
async function dragTo(page: Page, source: Locator, target: Locator) {
  const srcBox = await source.boundingBox();
  const tgtBox = await target.boundingBox();
  if (!srcBox || !tgtBox) throw new Error("Could not get element bounds");

  const sx = srcBox.x + srcBox.width / 2;
  const sy = srcBox.y + srcBox.height / 2;
  const tx = tgtBox.x + tgtBox.width / 2;
  const ty = tgtBox.y + tgtBox.height / 2;

  await page.mouse.move(sx, sy);
  await page.mouse.down();
  // Small initial movement to cross dnd-kit's activation threshold
  await page.mouse.move(sx + 5, sy + 5, { steps: 5 });
  await page.mouse.move(tx, ty, { steps: 20 });
  await page.mouse.up();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
});

// ── Column rendering ───────────────────────────────────────────────────────

test("skills appear in the correct columns", async ({ page }) => {
  await mockApi(page);
  await loginToDashboard(page);

  const notStarted = getColumn(page, "Not Started");
  const workingOn = getColumn(page, "Working On");
  const completed = getColumn(page, "Completed");

  await expect(
    notStarted.getByRole("button", { name: /Forward swizzles/ }),
  ).toBeVisible();
  await expect(
    workingOn.getByRole("button", { name: /Forward stroking/ }),
  ).toBeVisible();
  await expect(
    completed.getByRole("button", { name: /Two-foot spin/ }),
  ).not.toBeVisible(); // level 2
});

test("columns display the correct skill counts", async ({ page }) => {
  await mockApi(page);
  await loginToDashboard(page);

  // Level 1 has 1 not_started and 1 working_on
  const notStarted = getColumn(page, "Not Started");
  const workingOn = getColumn(page, "Working On");
  const completed = getColumn(page, "Completed");

  await expect(notStarted.getByText("1")).toBeVisible();
  await expect(workingOn.getByText("1")).toBeVisible();
  await expect(completed.getByText("0")).toBeVisible();
});

// ── Skill detail modal ─────────────────────────────────────────────────────

test("clicking a card opens the detail modal", async ({ page }) => {
  await mockApi(page);
  await loginToDashboard(page);

  await page.getByRole("button", { name: /Forward swizzles/ }).click();

  const dialog = page.getByRole("dialog", { name: "Forward swizzles" });
  await expect(dialog).toBeVisible();
});

test("modal shows existing notes for the skill", async ({ page }) => {
  await mockApi(page);
  await loginToDashboard(page);

  await page.getByRole("button", { name: /Forward swizzles/ }).click();

  await expect(page.getByRole("textbox", { name: /notes/i })).toHaveValue(
    "Keep knees soft",
  );
});

test("modal closes when the Close button is clicked", async ({ page }) => {
  await mockApi(page);
  await loginToDashboard(page);

  await page.getByRole("button", { name: /Forward swizzles/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.getByRole("button", { name: "Close" }).first().click();

  await expect(page.getByRole("dialog")).not.toBeVisible();
});

// ── Level expand / collapse ────────────────────────────────────────────────

test("clicking a level header collapses and expands it", async ({ page }) => {
  await mockApi(page);
  await loginToDashboard(page);

  const card = page.getByRole("button", { name: /Forward swizzles/ });
  await expect(card).toBeVisible();

  // Collapse Level 1
  await page.getByRole("button", { name: /^Level 1/ }).click();
  await expect(card).not.toBeVisible();

  // Expand Level 1
  await page.getByRole("button", { name: /^Level 1/ }).click();
  await expect(card).toBeVisible();
});

test("Collapse All hides all skill cards and Expand All shows them again", async ({
  page,
}) => {
  await mockApi(page);
  await loginToDashboard(page);

  await expect(
    page.getByRole("button", { name: /Forward swizzles/ }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Collapse All" }).click();
  await expect(page.getByRole("button", { name: "Expand All" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Forward swizzles/ }),
  ).not.toBeVisible();

  await page.getByRole("button", { name: "Expand All" }).click();
  await expect(
    page.getByRole("button", { name: /Forward swizzles/ }),
  ).toBeVisible();
});

// ── Error state ────────────────────────────────────────────────────────────

test("shows an error message when the skills API fails", async ({ page }) => {
  await page.route("**/users/profile", (route) =>
    route.fulfill({
      json: { id: "e2e-user-1", email: userEmail, active_track: "basic" },
    }),
  );
  await page.route("**/skills/**", (route) =>
    route.fulfill({ status: 500, json: { message: "Internal Server Error" } }),
  );

  await loginToDashboard(page);

  await expect(page.getByText("Something went wrong")).toBeVisible();
});

// ── Drag-and-drop ──────────────────────────────────────────────────────────

test("dragging a card to a new column calls the status API and moves the card", async ({
  page,
}) => {
  await mockApi(page);
  await loginToDashboard(page);

  const card = page.getByRole("button", { name: /Forward swizzles/ });
  const completedCol = getColumn(page, "Completed");

  // Capture the PATCH request
  const patchPromise = page.waitForRequest(
    (req) => req.method() === "PATCH" && req.url().includes("/skills/1"),
  );

  await dragTo(page, card, completedCol);

  const patch = await patchPromise;
  expect(patch.postDataJSON()).toMatchObject({ status: "completed" });

  // Card should now be in the Completed column
  await expect(
    completedCol.getByRole("button", { name: /Forward swizzles/ }),
  ).toBeVisible();
  await expect(
    getColumn(page, "Not Started").getByRole("button", {
      name: /Forward swizzles/,
    }),
  ).not.toBeVisible();
});

test("dragging a card back to the same column is a no-op (no API call)", async ({
  page,
}) => {
  await mockApi(page, multiCardSkills);
  await loginToDashboard(page);

  const card1 = page.getByRole("button", { name: /^Forward swizzles/ });
  const card2 = page.getByRole("button", { name: /^Backward swizzles/ });

  let apiCalled = false;
  page.on("request", (req) => {
    if (req.method() === "PATCH" && req.url().includes("/skills/")) {
      apiCalled = true;
    }
  });

  // Drag within the same column (card1 onto card2)
  await dragTo(page, card1, card2);

  // Both cards still in the same column confirms drag settled
  await expect(
    getColumn(page, "Not Started").getByRole("button", {
      name: /^Forward swizzles/,
    }),
  ).toBeVisible();
  expect(apiCalled).toBe(false);
});

// ── localStorage order ─────────────────────────────────────────────────────

test("card order saved in localStorage is restored on page reload", async ({
  page,
}) => {
  await mockApi(page, multiCardSkills);

  // Prime localStorage before the page boots: Backward swizzles (id=2) before Forward swizzles (id=1)
  await page.addInitScript(() => {
    localStorage.setItem(
      "spiral-skill-order-basic-1",
      JSON.stringify([2, 1, 3]),
    );
  });

  await loginToDashboard(page);

  const notStartedCol = getColumn(page, "Not Started");
  const cards = notStartedCol.getByRole("button");

  await expect(cards.nth(0)).toContainText("Backward swizzles");
  await expect(cards.nth(1)).toContainText("Forward swizzles");
});

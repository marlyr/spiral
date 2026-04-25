import { expect, test, type Page } from "@playwright/test";

type ActiveTrack = "basic" | "adult" | "pre_freeskate" | "freeskate" | null;

const userEmail = "skater@example.com";
const validPassword = "password123";

const defaultSkills = [
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

async function mockApi(page: Page, activeTrack: ActiveTrack = "basic") {
  let profileActiveTrack = activeTrack;

  await page.route("**/users/profile", async (route) => {
    await route.fulfill({
      json: {
        id: "e2e-user-1",
        email: userEmail,
        active_track: profileActiveTrack,
      },
    });
  });

  await page.route("**/users/track", async (route) => {
    const body = route.request().postDataJSON() as {
      active_track?: ActiveTrack;
    };
    profileActiveTrack = body.active_track ?? "basic";

    await route.fulfill({
      json: { active_track: profileActiveTrack },
    });
  });

  await page.route("**/skills/**", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({ json: defaultSkills });
      return;
    }

    await route.fulfill({
      json: {
        id: Number(route.request().url().split("/").pop()),
        status: "working_on",
      },
    });
  });
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
});

test("redirects logged-out users from protected pages to login", async ({
  page,
}) => {
  await mockApi(page);

  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText("Welcome back!")).toBeVisible();
});

test("shows a login error for invalid credentials", async ({ page }) => {
  await mockApi(page);
  await page.goto("/login");

  await page.getByLabel("Email").fill(userEmail);
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Incorrect email or password")).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test("signs in a user with an active track and opens the dashboard", async ({
  page,
}) => {
  await mockApi(page, "basic");
  await page.goto("/login");

  await page.getByLabel("Email").fill(userEmail);
  await page.getByLabel("Password").fill(validPassword);
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText("Forward swizzles")).toBeVisible();
  await expect(page.getByText("Forward stroking")).toBeVisible();
});

test("sends signed-in users without a track through track selection", async ({
  page,
}) => {
  await mockApi(page, null);
  await page.goto("/login");

  await page.getByLabel("Email").fill(userEmail);
  await page.getByLabel("Password").fill(validPassword);
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/\/track-selection$/);
  await expect(
    page.getByRole("heading", { name: "Choose your track." }),
  ).toBeVisible();

  await page.getByRole("button", { name: /Basic Skills/ }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText("Forward swizzles")).toBeVisible();
});

test("registers a new user and shows the check-email screen", async ({
  page,
}) => {
  await mockApi(page);
  await page.goto("/register");

  await page.getByLabel("Email").fill("new-skater@example.com");
  await page.getByLabel("Password", { exact: true }).fill(validPassword);
  await page.getByLabel("Confirm Password").fill(validPassword);
  await page.getByRole("button", { name: "Create Account" }).click();

  await expect(page).toHaveURL(/\/check-email$/);
  await expect(page.getByText("Check your email")).toBeVisible();
});

test("starts password recovery and lands on reset password from the callback", async ({
  page,
}) => {
  await mockApi(page);
  await page.goto("/forgot-password");

  await page.getByLabel("Email").fill(userEmail);
  await page.getByRole("button", { name: "Confirm" }).click();

  await expect(
    page.getByText(
      "If an account exists for this email, a reset link has been sent.",
    ),
  ).toBeVisible();

  await page.goto("/auth/callback?type=recovery");

  await expect(page).toHaveURL(/\/reset-password$/);
  await expect(page.getByText("Reset Password")).toBeVisible();
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { createMockSupabase } from "@/test-utils/mock-supabase";
import { makeSession } from "@/test-utils/fixtures";

function getAuthorizationHeader(headers: unknown) {
  if (!headers || typeof headers !== "object") {
    return undefined;
  }

  const typedHeaders = headers as {
    Authorization?: string;
    get?: (name: string) => string | undefined;
  };

  return typedHeaders.get?.("Authorization") ?? typedHeaders.Authorization;
}

async function loadApi() {
  vi.resetModules();
  const mockSupabase = createMockSupabase();
  vi.doMock("@/lib/supabase", () => ({ supabase: mockSupabase.supabase }));
  const apiModule = await import("@/lib/api");

  return {
    api: apiModule.default,
    apiNavigation: apiModule.apiNavigation,
    mockSupabase,
  };
}

afterEach(() => {
  vi.doUnmock("@/lib/supabase");
  vi.resetModules();
  window.history.replaceState({}, "", "/");
});

describe("api", () => {
  it("attaches an Authorization header when a session exists", async () => {
    const { api, mockSupabase } = await loadApi();
    mockSupabase.supabase.auth.getSession.mockResolvedValue({
      data: { session: makeSession({ access_token: "token-123" }) },
    });

    const adapter = vi.fn(async (config) => ({
      data: { ok: true },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    }));
    api.defaults.adapter = adapter;

    await api.get("/skills/");

    expect(mockSupabase.supabase.auth.getSession).toHaveBeenCalled();
    expect(getAuthorizationHeader(adapter.mock.calls[0][0].headers)).toBe(
      "Bearer token-123",
    );
  });

  it("skips the Authorization header when no session exists", async () => {
    const { api } = await loadApi();

    const adapter = vi.fn(async (config) => ({
      data: { ok: true },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    }));
    api.defaults.adapter = adapter;

    await api.get("/skills/");

    expect(getAuthorizationHeader(adapter.mock.calls[0][0].headers)).toBe(
      undefined,
    );
  });

  it("signs the user out and redirects on a 401 outside auth routes", async () => {
    window.history.replaceState({}, "", "/dashboard");
    const { api, apiNavigation, mockSupabase } = await loadApi();
    const redirectSpy = vi
      .spyOn(apiNavigation, "redirectToLogin")
      .mockImplementation(() => {});

    api.defaults.adapter = vi.fn(async () => {
      throw { response: { status: 401 } };
    });

    await expect(api.get("/skills/")).rejects.toMatchObject({
      response: { status: 401 },
    });

    expect(mockSupabase.supabase.auth.signOut).toHaveBeenCalledOnce();
    expect(redirectSpy).toHaveBeenCalledOnce();
  });

  it("does not redirect on auth routes when a 401 is returned", async () => {
    window.history.replaceState({}, "", "/login");
    const { api, mockSupabase } = await loadApi();

    api.defaults.adapter = vi.fn(async () => {
      throw { response: { status: 401 } };
    });

    await expect(api.get("/login")).rejects.toMatchObject({
      response: { status: 401 },
    });

    expect(mockSupabase.supabase.auth.signOut).not.toHaveBeenCalled();
    expect(window.location.pathname).toBe("/login");
  });
});

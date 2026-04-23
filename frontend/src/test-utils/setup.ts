import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "./msw-server";

class MockPointerEvent extends MouseEvent {}

class MockResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}

if (!window.PointerEvent) {
  Object.defineProperty(window, "PointerEvent", {
    writable: true,
    configurable: true,
    value: MockPointerEvent,
  });
}

if (!window.ResizeObserver) {
  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    configurable: true,
    value: MockResizeObserver,
  });
}

if (!HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = vi.fn();
}

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  vi.useRealTimers();
  window.history.replaceState({}, "", "/");
});

afterAll(() => {
  server.close();
});

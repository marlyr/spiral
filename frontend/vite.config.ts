import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "127.0.0.1",
    proxy: {
      "/users": "http://127.0.0.1:8000",
      "/skills": "http://127.0.0.1:8000",
    },
    watch: {
      ignored: ["**/tsconfig*.json", "**/.env*"],
    },
  },
  test: {
    environment: "jsdom",
    environmentOptions: {
      jsdom: {
        url: "http://localhost:3000",
      },
    },
    setupFiles: ["./src/test-utils/setup.ts"],
    fileParallelism: false,
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/lib/api.ts",
        "src/lib/utils.ts",
        "src/context/auth-context.tsx",
        "src/components/protected-route.tsx",
        "src/components/login-form.tsx",
        "src/components/signup-form.tsx",
        "src/components/avatar-dropdown.tsx",
        "src/components/track-selection.tsx",
        "src/components/skill-card.tsx",
        "src/components/skill-detail-modal.tsx",
        "src/components/kanban-board.tsx",
        "src/components/kanban-view.tsx",
        "src/pages/AuthCallback.tsx",
        "src/pages/ForgotPassword.tsx",
        "src/pages/ResetPassword.tsx",
      ],
      exclude: ["src/__tests__/**", "src/test-utils/**"],
      thresholds: {
        lines: 80,
        statements: 80,
        functions: 80,
        branches: 80,
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react-router-dom",
      "axios",
      "clsx",
      "tailwind-merge",
      "class-variance-authority",
      "radix-ui",
      "@dnd-kit/react",
      "@dnd-kit/state",
      "@dnd-kit/abstract",
      "@dnd-kit/geometry",
      "@dnd-kit/dom",
    ],
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
});

/// <reference types="vitest" />

import react from "@vitejs/plugin-react"
import { resolve } from "path"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      reporter: ["text", "json", "html"]
    }
  },
  resolve: {
    alias: {
      "@/hooks": resolve("src/hooks"),
      "@/assets": resolve("src/assets"),
      "@/components": resolve("src/components"),
      "@/utils": resolve("src/utils"),
      "@/pages": resolve("src/pages"),
      "@/services": resolve("src/services"),
      "@/app": resolve("src/app"),
      "@/features": resolve("src/features"),
      "@/shared": resolve("src/shared")
    }
  }
})

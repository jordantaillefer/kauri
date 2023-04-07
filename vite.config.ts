import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import type { UserConfig } from "vite"
import { defineConfig } from "vite"
import type { InlineConfig } from "vitest"

interface VitestConfigExport extends UserConfig {
  test: InlineConfig
}

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/setup-test-env.ts", "config.ts"],
    include: ["./src/**/*.test.ts", "./app/**/*.spec.ts"],
    watchExclude: [".*\\/node_modules\\/.*", ".*\\/build\\/.*", ".*\\/postgres-data\\/.*"]
  }
} as VitestConfigExport)

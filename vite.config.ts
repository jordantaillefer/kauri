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
    cache: false,
    globals: true,
    environment: "happy-dom",
    setupFiles: ["config.ts", "./test/setup-test-env.ts"],
    include: ["./app/server/**/*.test.ts", "./app/**/*.spec.ts"],
    watchExclude: [".*\\/node_modules\\/.*", ".*\\/build\\/.*", ".*\\/postgres-data\\/.*"]
  }
} as VitestConfigExport)

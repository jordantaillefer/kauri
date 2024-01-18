import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    cache: false,
    globals: true,
    environment: "happy-dom",
    setupFiles: ["config.server.ts", "./test/setup-test-env.ts"],
    include: ["./app/.server/**/*.test.ts", "./app/**/*.spec.ts"],
    watchExclude: [".*\\/node_modules\\/.*", ".*\\/build\\/.*", ".*\\/postgres-data\\/.*"]
  }
})

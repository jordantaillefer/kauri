import { unstable_vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vite"

import { installGlobals } from "@remix-run/node";

installGlobals();

export default defineConfig({
  plugins: [remix({
    ignoredRouteFiles: ["**/.*"],
  }), tsconfigPaths()]
})

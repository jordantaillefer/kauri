/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  watchPaths: ["src"],
  postcss: true,
  future: {
    unstable_tailwind: true,
    unstable_postcss: true,
  },
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
}

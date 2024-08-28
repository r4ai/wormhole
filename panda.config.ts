import { defineConfig } from "@pandacss/dev"
import wormhole from "@wormhole/ui/preset"

export default defineConfig({
  presets: ["@pandacss/dev/presets", wormhole],
  preflight: true,
  include: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@wormhole/ui/src/**/*.{js,jsx,ts,tsx}",
  ],
  exclude: [],
  outdir: "./packages/styled-system/dist",
  importMap: "@wormhole/styled-system",
  jsxFramework: "solid",
})

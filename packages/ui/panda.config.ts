import preset from "@/preset"
import { defineConfig } from "@pandacss/dev"

export default defineConfig({
  presets: ["@pandacss/dev/presets", preset],
  preflight: true,
  prefix: "wh",
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  exclude: [],
  outdir: "../styled-system/dist",
  importMap: "@wormhole/styled-system",
  jsxFramework: "solid",
})

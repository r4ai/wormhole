import { defineConfig } from "@pandacss/dev"
import preset from "./src/preset"

export default defineConfig({
  presets: ["@pandacss/dev/presets", preset],
  preflight: true,
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./.storybook/**/*.{js,jsx,ts,tsx}"],
  exclude: [],
  outdir: "../styled-system/dist",
  importMap: "@wormhole/styled-system",
  jsxFramework: "solid",
  globalCss: {
    ".docs-story": {
      backgroundColor: "background",
    },
  },
})

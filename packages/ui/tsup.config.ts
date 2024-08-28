import { solidPlugin } from "esbuild-plugin-solid"
import { defineConfig } from "tsup"
import type { Options } from "tsup"
import { dependencies } from "./package.json"

function generateConfig(format: "esm" | "cjs", jsx: boolean): Options {
  return {
    target: "esnext",
    platform: "browser",
    format,
    clean: true,
    dts: format === "esm" && !jsx,
    entry: ["src/index.ts", "src/preset.ts", "src/button/index.ts"],
    outDir: "dist/",
    treeshake: { preset: "smallest" },
    replaceNodeEnv: true,
    esbuildOptions(options) {
      if (jsx) {
        options.jsx = "preserve"
      }
      options.chunkNames = "[name]/[hash]"
      options.drop = ["console", "debugger"]
    },
    outExtension() {
      if (jsx) {
        return { js: ".jsx" }
      }
      return {}
    },
    external: [...Object.keys(dependencies), "@pandacss/dev"],
    esbuildPlugins: !jsx ? [solidPlugin({ solid: { generate: "dom" } })] : [],
  }
}

export default defineConfig([
  generateConfig("esm", false),
  generateConfig("esm", true),
])

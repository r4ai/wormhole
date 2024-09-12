export default {
  replace: {
    exports: {
      ".": {
        types: "./dist/index.d.ts",
        solid: "./dist/index.jsx",
        default: "./dist/index.js",
      },
      "./styles.css": "./dist/styles.css",
      "./*": {
        types: "./dist/*/index.d.ts",
        solid: "./dist/*/index.jsx",
        default: "./dist/*/index.js",
      },
      "./internal/*": {
        types: "./dist/internal/*/index.d.ts",
        solid: "./dist/internal/*/index.jsx",
        default: "./dist/internal/*/index.js",
      },
    },
  },
}
export default {
  replace: {
    exports: {
      "./*": {
        import: "./dist/*.js",
        types: "./dist/*.d.ts",
      },
    },
  },
}
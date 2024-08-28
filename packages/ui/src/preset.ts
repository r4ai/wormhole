import { defineGlobalStyles, definePreset } from "@pandacss/dev"

export default definePreset({
  name: "wormhole",
  theme: {
    extend: {
      semanticTokens: {
        colors: {
          foreground: {
            DEFAULT: {
              value: {
                base: "{colors.zinc.950}",
                _dark: "{colors.zinc.50}",
              },
            },
            muted: {
              value: {
                base: "{colors.zinc.600}",
                _dark: "{colors.zinc.400}",
              },
            },
            accent: {
              value: {
                base: "{colors.zinc.50}",
                _dark: "{colors.zinc.900}",
              },
            },
          },
          background: {
            DEFAULT: {
              value: {
                base: "{colors.white}",
                _dark: "{colors.zinc.950}",
              },
            },
            muted: {
              value: {
                base: "{colors.zinc.100}",
                _dark: "{colors.zinc.900}",
              },
            },
            accent: {
              value: {
                base: "{colors.zinc.900}",
                _dark: "{colors.zinc.100}",
              },
            },
          },
          border: {
            DEFAULT: {
              value: {
                base: "{colors.zinc.200}",
                _dark: "{colors.zinc.800}",
              },
            },
            input: {
              value: {
                base: "{colors.zinc.300}",
                _dark: "{colors.zinc.700}",
              },
            },
          },
          outline: {
            value: {
              base: "{colors.zinc.400}",
              _dark: "{colors.zinc.600}",
            },
          },
        },
      },
    },
  },
  globalCss: defineGlobalStyles({
    body: {
      backgroundColor: "background",
      color: "foreground",
    },
    "*": {
      borderColor: "border",
      outlineColor: "outline",
    },
  }),
})

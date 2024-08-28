import { defineGlobalStyles, definePreset } from "@pandacss/dev"

export const wormhole = definePreset({
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
                base: "{colors.zinc.500}",
                _dark: "{colors.zinc.400}",
              },
            },
            primary: {
              value: {
                base: "{colors.zinc.50}",
                _dark: "{colors.zinc.900}",
              },
            },
            secondary: {
              value: {
                base: "{colors.zinc.900}",
                _dark: "{colors.zinc.50}",
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
                _dark: "{colors.zinc.800}",
              },
            },
            primary: {
              value: {
                base: "{colors.zinc.900}",
                _dark: "{colors.zinc.50}",
              },
            },
            secondary: {
              value: {
                base: "{colors.zinc.100}",
                _dark: "{colors.zinc.800}",
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
  conditions: {
    light: "[data-color-scheme=light] &",
    dark: "[data-color-scheme=dark] &",
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

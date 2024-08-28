import { cva } from "@wormhole/styled-system/css"

export const square = cva({
  base: {
    height: "16",
    width: "16",
    rounded: "xl",
    borderWidth: "1px",
    borderColor: "border",
    bg: "background.primary",
  },
  variants: {
    color: {
      foreground: {
        color: "foreground",
      },
    },
  },
})

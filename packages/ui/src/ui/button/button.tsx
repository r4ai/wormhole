import type { PolymorphicProps } from "@kobalte/core"
import {
  Button as ButtonPrimitive,
  type ButtonRootProps as ButtonPrimitiveProps,
} from "@kobalte/core/button"
import { type RecipeVariantProps, cva, cx } from "@wormhole/styled-system/css"
import { type ValidComponent, splitProps } from "solid-js"

export const button = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    rounded: "md",
    fontSize: "sm",
    fontWeight: "medium",
    outlineOffset: "2",
    transition: "colors",
    cursor: "pointer",
    _focusVisible: {
      outlineWidth: "2px",
      outlineOffset: "2px",
    },
    _disabled: {
      opacity: 0.5,
      pointerEvents: "none",
    },
  },
  variants: {
    variant: {
      primary: {
        bg: "background.primary",
        color: "foreground.primary",
        _hover: {
          bg: "background.primary/90",
        },
      },
      secondary: {
        bg: "background.secondary",
        color: "foreground.secondary",
        _hover: {
          bg: "background.secondary/90",
        },
      },
      outline: {
        borderWidth: "1px",
        borderColor: "border",
        bg: "background",
        _hover: {
          bg: "background.muted",
        },
      },
      ghost: {
        _hover: {
          bg: "background.muted",
        },
      },
      link: {
        textUnderlineOffset: "4px",
        _hover: {
          textDecoration: "underline",
        },
      },
    },
    size: {
      sm: {
        height: "9",
        rounded: "md",
        px: "3",
      },
      md: {
        height: "10",
        px: "4",
        py: "2",
      },
      lg: {
        height: "11",
        rounded: "md",
        px: "8",
      },
      icon: {
        height: "10",
        width: "10",
      },
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
})

export type ButtonVariants = RecipeVariantProps<typeof button>

export type ButtonProps<T extends ValidComponent = "button"> =
  ButtonPrimitiveProps<T> & ButtonVariants & { class?: string }

export const Button = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ButtonProps<T>>,
) => {
  const [local, variants, others] = splitProps(
    props as ButtonProps,
    ["class"],
    button.variantKeys,
  )

  return (
    <ButtonPrimitive class={cx(button(variants), local.class)} {...others} />
  )
}

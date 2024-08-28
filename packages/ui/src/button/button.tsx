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
      default: {
        bg: "background.accent",
        color: "foreground.accent",
        _hover: {
          bg: "background.accent/90",
        },
      },
      outline: {
        borderWidth: "1px",
        borderColor: "border.input",
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
      default: {
        height: "10",
        px: "4",
        py: "2",
      },
      sm: {
        height: "9",
        rounded: "md",
        px: "3",
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
    variant: "default",
    size: "default",
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

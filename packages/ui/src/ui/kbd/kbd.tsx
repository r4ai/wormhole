import { Polymorphic, type PolymorphicProps } from "@kobalte/core"
import {
  type RecipeVariantProps,
  css,
  cva,
  cx,
} from "@wormhole/styled-system/css"
import type { JsxStyleProps } from "@wormhole/styled-system/types"
import { type ComponentProps, type ValidComponent, splitProps } from "solid-js"

export const kbd = cva({
  base: {
    alignItems: "center",
    bg: "background.muted",
    borderWidth: "1px",
    borderColor: "border.input",
    borderRadius: "md",
    color: "fg.default",
    display: "inline-flex",
    fontFamily: "mono",
    fontWeight: "medium",
    whiteSpace: "pre",
  },
  defaultVariants: {
    size: "md",
  },
  variants: {
    size: {
      sm: {
        minHeight: "5",
        px: "0.5",
        textStyle: "xs",
      },
      md: {
        minHeight: "6",
        textStyle: "sm",
        px: "1",
        py: "1px",
      },
      lg: {
        minHeight: "7",
        px: "1.5",
        py: "1px",
        textStyle: "md",
      },
    },
  },
})

export type KbdVariants = RecipeVariantProps<typeof kbd>

export type KbdProps<T extends ValidComponent = "code"> = ComponentProps<T> &
  KbdVariants & { class?: string; css?: JsxStyleProps }

export const Kbd = <T extends ValidComponent = "code">(
  props: PolymorphicProps<T, KbdProps<T>>,
) => {
  const [local, variants, others] = splitProps(
    props as KbdProps,
    ["class", "css"],
    kbd.variantKeys,
  )

  return (
    <Polymorphic<KbdProps>
      as="code"
      class={cx(css(kbd.raw(variants), local.css), local.class)}
      {...others}
    />
  )
}

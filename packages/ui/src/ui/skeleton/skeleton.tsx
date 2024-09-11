import { Polymorphic, type PolymorphicProps } from "@kobalte/core"
import {
  type RecipeVariantProps,
  css,
  cva,
  cx,
} from "@wormhole/styled-system/css"
import type { JsxStyleProps } from "@wormhole/styled-system/types"
import { type ComponentProps, type ValidComponent, splitProps } from "solid-js"

export const skeleton = cva({
  base: {
    animation: "pulse",
    rounded: "md",
    background: "background.primary/10",
    height: "full",
    width: "full",
  },
})

export type SkeletonVariants = RecipeVariantProps<typeof skeleton>

export type SkeletonProps<T extends ValidComponent = "div"> =
  ComponentProps<T> & SkeletonVariants & { class?: string; css?: JsxStyleProps }

export const Skeleton = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SkeletonProps<T>>,
) => {
  const [local, variants, others] = splitProps(
    props as SkeletonProps,
    ["class", "css"],
    skeleton.variantKeys,
  )

  return (
    <Polymorphic<SkeletonProps>
      as="div"
      class={cx(css(skeleton.raw(variants), local.css), local.class)}
      {...others}
    />
  )
}

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import * as SelectPrimitive from "@kobalte/core/select"
import { css, cx } from "@wormhole/styled-system/css"
import type { JsxStyleProps } from "@wormhole/styled-system/types"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-solid"
import type { ParentProps, ValidComponent } from "solid-js"
import { splitProps } from "solid-js"

export type SelectProps<T> = SelectPrimitive.SelectRootProps<T>

export const Select = SelectPrimitive.Select
export const SelectValue = SelectPrimitive.Value
export const SelectDescription = SelectPrimitive.Description
export const SelectErrorMessage = SelectPrimitive.ErrorMessage
export const SelectItemDescription = SelectPrimitive.ItemDescription
export const SelectHiddenSelect = SelectPrimitive.HiddenSelect
export const SelectSection = SelectPrimitive.Section

export type SelectTriggerProps<T extends ValidComponent = "button"> =
  ParentProps<
    SelectPrimitive.SelectTriggerProps<T> & {
      class?: string
      css?: JsxStyleProps
    }
  >

export const SelectTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, SelectTriggerProps<T>>,
) => {
  const [local, rest] = splitProps(props as SelectTriggerProps, [
    "class",
    "css",
    "children",
  ])

  return (
    <SelectPrimitive.Trigger
      class={cx(
        css(
          {
            display: "flex",
            height: "h-9",
            width: "w-full",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2",
            rounded: "md",
            borderWidth: "1px",
            borderColor: "border",
            background: "transparent",
            paddingX: "3",
            paddingY: "2",
            fontSize: "sm",
            shadow: "sm",
            transition: "shadow",
            outlineOffset: "1",
            outlineColor: "outline",
            cursor: "pointer",
            _placeholder: {
              color: "foreground.muted",
            },
            _focusVisible: {
              outlineWidth: "1.5px",
              outlineColor: "outline",
            },
            _disabled: {
              cursor: "not-allowed",
              opacity: "50%",
            },
          },
          local.css,
        ),
        local.class,
      )}
      {...rest}
    >
      <SelectPrimitive.Value>{local.children}</SelectPrimitive.Value>
      <SelectPrimitive.Icon>
        <ChevronsUpDownIcon
          size={16}
          class={css({
            color: "foreground.muted",
          })}
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

export type SelectContentProps<T extends ValidComponent = "div"> =
  SelectPrimitive.SelectContentProps<T> & {
    class?: string
    css?: JsxStyleProps
  }

export const SelectContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SelectContentProps<T>>,
) => {
  const [local, rest] = splitProps(props as SelectContentProps, [
    "class",
    "css",
  ])

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        class={cx(
          css(
            {
              position: "relative",
              zIndex: "50",
              minWidth: "8rem",
              overflow: "hidden",
              rounded: "md",
              borderWidth: "1px",
              background: "background",
              color: "foreground",
              shadow: "md",
              "&[data-expanded]": {
                // todo: add animation
                animation: "ease-in",
              },
              "&[data-closed]": {
                // todo: add animation
                animation: "ease-out",
              },
            },
            local.css,
          ),
          local.class,
        )}
        {...rest}
      >
        <SelectPrimitive.Listbox
          class={css({
            padding: "1",
            _focusVisible: {
              outline: "none",
            },
          })}
        />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

export type SelectItemProps<T extends ValidComponent = "li"> = ParentProps<
  SelectPrimitive.SelectItemProps<T> & { class?: string; css?: JsxStyleProps }
>

export const SelectItem = <T extends ValidComponent = "li">(
  props: PolymorphicProps<T, SelectItemProps<T>>,
) => {
  const [local, rest] = splitProps(props as SelectItemProps, [
    "class",
    "css",
    "children",
  ])

  return (
    <SelectPrimitive.Item
      class={cx(
        css(
          {
            position: "relative",
            display: "flex",
            width: "full",
            cursor: "default",
            userSelect: "none",
            alignItems: "center",
            rounded: "sm",
            paddingY: "1.5",
            paddingLeft: "2",
            paddingRight: "8",
            fontSize: "sm",
            outline: "none",
            _focus: {
              background: "background.muted",
            },
            "&[data-disabled]": {
              pointerEvents: "none",
              opacity: "50%",
            },
          },
          local.css,
        ),
        local.class,
      )}
      {...rest}
    >
      <SelectPrimitive.ItemIndicator
        class={css({
          position: "absolute",
          right: "2",
          display: "flex",
          height: "3.5",
          width: "3.5",
          alignItems: "center",
          justifyContent: "center",
        })}
      >
        <CheckIcon />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemLabel>{local.children}</SelectPrimitive.ItemLabel>
    </SelectPrimitive.Item>
  )
}

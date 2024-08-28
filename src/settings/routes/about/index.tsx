import { css } from "@wormhole/styled-system/css"
import { Layers2Icon } from "lucide-solid"

export const About = () => {
  return (
    <div
      class={css({
        height: "full",
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
      })}
    >
      <div
        class={css({
          display: "flex",
          flexDir: "row",
          alignItems: "center",
          gap: "4",
        })}
      >
        <Layers2Icon class={css({ color: "foreground.muted" })} size={48} />
        <div>
          <p class={css({ fontWeight: "bold", fontSize: "lg" })}>Wormhole</p>
          <p class={css({ fontSize: "sm" })}>Version 0.0.0</p>
          <p
            class={css({ fontSize: "sm", color: "foreground.muted", mt: "2" })}
          >
            Copyright © Rai 2024
          </p>
        </div>
      </div>
    </div>
  )
}

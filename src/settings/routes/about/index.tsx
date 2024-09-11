import { convertFileSrc } from "@tauri-apps/api/core"
import { appDataDir, join } from "@tauri-apps/api/path"
import { css } from "@wormhole/styled-system/css"
import { Layers2Icon } from "lucide-solid"
import { createEffect } from "solid-js"

export const About = () => {
  createEffect(async () => {
    const path = await join(await appDataDir(), "plugins/hoge.js")
    console.log("path", path)
    const convertedPath = convertFileSrc(path)
    console.log("convertedPath", convertedPath)
    /* @vite-ignore */
    const mod = await import(convertedPath)
    const { getApplications } = mod
    console.log("getApplications", await getApplications())
  })

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

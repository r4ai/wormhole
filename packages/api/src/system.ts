import { invoke } from "@tauri-apps/api/core"

export type OpenQuery = {
  path: string
}

export const open = async (path: string) => {
  await invoke("system_open", { path } satisfies OpenQuery)
}

export const extractIconFromExecutable = async (src: string, dest: string) => {
  const extractedIconPath = await invoke<string>(
    "system_extract_icon_from_executable",
    { src, dest },
  )
  return extractedIconPath
}

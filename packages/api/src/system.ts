import { invoke } from "@tauri-apps/api/core"

export type OpenQuery = {
  path: string
}

export const open = async (path: string) => {
  await invoke("system_open", { path } satisfies OpenQuery)
}

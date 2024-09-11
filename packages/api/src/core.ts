import { convertFileSrc } from "@tauri-apps/api/core"
import * as path from "@tauri-apps/api/path"
import type { Action } from "./schema.js"

export const getActionFn = async (pluginId: string, action: Action) => {
  const { scope, name } = parsePluginId(pluginId)

  const appDataDir = await path.appDataDir()
  const scriptFilePath = await path.resolve(
    appDataDir,
    "plugins",
    `${scope}.${name}`,
    action.scriptFilePath,
  )
  const convertedScriptFilePath = convertFileSrc(scriptFilePath)

  /* @vite-ignore */
  const mod = await import(convertedScriptFilePath)
  const fn = mod[action.functionName]
  if (!fn) {
    throw new Error(
      `Function ${action.functionName} not found in ${action.scriptFilePath}`,
    )
  }

  return async () => fn(...(action.args ?? []))
}

export const parsePluginId = (pluginId: string) => {
  const [scope, name] = pluginId.match(/@(.+?)\/(.+)/)?.slice(1) ?? []
  return { scope, name }
}

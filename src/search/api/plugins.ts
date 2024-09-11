import { convertFileSrc } from "@tauri-apps/api/core"
import { emit, listen } from "@tauri-apps/api/event"
import * as path from "@tauri-apps/api/path"
import { Store } from "@tauri-apps/plugin-store"
import type { Action, Hooks, Plugin } from "@wormhole/api"
import { kebabCase } from "scule"

export const initPluginsListeners = async () => {
  console.log("initiating plugins listeners")
  const plugins = await getPlugins()
  const unlisten = await initPlugins(plugins)
  console.log("initiated plugins listeners")

  return () => {
    unlisten()
    console.log("unlisten plugins listeners")
  }
}

const getPlugins = async () => {
  const store = new Store("settings.bin")
  const plugins: Plugin[] = (await store.get("wormhole.core.plugins")) ?? []
  return plugins
}

const initPlugins = async (plugins: Plugin[]) => {
  console.log("initiating plugins")
  const unlistenFunctions: (() => void)[] = []
  for (const plugin of plugins) {
    const unlisten = (await initPlugin(plugin)) ?? (() => {})
    unlistenFunctions.push(unlisten)
  }
  await emit("wormhole://on-enable")

  return () => {
    for (const unlisten of unlistenFunctions) {
      unlisten()
    }
  }
}

const initPlugin = async (plugin: Plugin) => {
  if (plugin.hooks) {
    return registerHooks(plugin.id, plugin.hooks)
  }
}

const registerHooks = async (pluginId: string, hooks: Hooks) => {
  const unlistenFunctions: (() => void)[] = []
  for (const [hookName, action] of Object.entries(hooks)) {
    if (action == null) continue
    const unlisten = await registerHook(pluginId, kebabCase(hookName), action)
    unlistenFunctions.push(unlisten)
  }

  return () => {
    for (const unlisten of unlistenFunctions) {
      unlisten()
    }
  }
}

const registerHook = async (
  pluginId: string,
  hookName: string,
  action: Action,
) => {
  const { scope, name } = parsePluginId(pluginId)
  const broadcastHookName = `wormhole://${hookName}`
  const pluginSpecificHookName = `${broadcastHookName}/${scope}/${name}`

  const fn = await getActionFn(pluginId, action)

  const unlistenBroadcast = await listen(broadcastHookName, fn)
  const unlistenPluginSpecific = await listen(pluginSpecificHookName, fn)
  console.log(
    `registered hooks "${broadcastHookName}" and "${pluginSpecificHookName}" for plugin "${pluginId}"`,
  )

  return () => {
    unlistenBroadcast()
    unlistenPluginSpecific()
  }
}

const getActionFn = async (pluginId: string, action: Action) => {
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

const parsePluginId = (pluginId: string) => {
  const [scope, name] = pluginId.match(/@(.+?)\/(.+)/)?.slice(1) ?? []
  return { scope, name }
}

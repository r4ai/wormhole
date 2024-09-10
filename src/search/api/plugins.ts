import { listen } from "@tauri-apps/api/event"
import * as path from "@tauri-apps/api/path"
import type { Action, Hooks, Plugin } from "@wormhole/api"
import { kebabCase } from "scule"

export const initPluginsListeners = async () => {
  const unlistenFunctions: (() => void)[] = []
  const unlistenInitPlugins = await listen<Plugin[]>(
    "wormhole://init-plugins",
    async (event) => {
      const unlisten = await initPlugins(event.payload)
      unlistenFunctions.push(unlisten)
    },
  )

  return () => {
    unlistenInitPlugins()
    for (const unlisten of unlistenFunctions) {
      unlisten()
    }
  }
}

const initPlugins = async (plugins: Plugin[]) => {
  const unlistenFunctions: (() => void)[] = []
  for (const plugin of plugins) {
    const unlisten = (await initPlugin(plugin)) ?? (() => {})
    unlistenFunctions.push(unlisten)
  }

  return () => {
    for (const unlisten of unlistenFunctions) {
      unlisten()
    }
  }
}

const initPlugin = async (plugin: Plugin) => {
  if (plugin.hooks) {
    return registerHooks(plugin.name, plugin.hooks)
  }
}

const registerHooks = async (pluginName: string, hooks: Hooks) => {
  const unlistenFunctions: (() => void)[] = []
  for (const [hookName, action] of Object.entries(hooks)) {
    const unlisten = await registerHook(pluginName, kebabCase(hookName), action)
    unlistenFunctions.push(unlisten)
  }

  return () => {
    for (const unlisten of unlistenFunctions) {
      unlisten()
    }
  }
}

const registerHook = async (
  pluginName: string,
  hookName: string,
  action: Action,
) => {
  const fn = await getActionFn(pluginName, action)
  return listen(hookName, fn)
}

const getActionFn = async (pluginName: string, action: Action) => {
  const appDataDir = await path.appDataDir()
  const mod = await import(
    await path.resolve(appDataDir, "plugins", pluginName, action.scriptFilePath)
  )
  const fn = mod[action.functionName]
  if (!fn) {
    throw new Error(
      `Function ${action.functionName} not found in ${action.scriptFilePath}`,
    )
  }
  return () => fn(...(action.args ?? []))
}

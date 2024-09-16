import { invoke } from "@tauri-apps/api/core"
import { Store } from "@tauri-apps/plugin-store"
import { createPluginId, parsePluginId } from "./core.js"
import type { Command, Plugin } from "./schema.js"

export const DB_STORE_PATH = "db.bin"

export const initDatabase = (
  pluginId: Plugin["id"],
  store = new Store(DB_STORE_PATH),
) => ({
  set: (command: Command) => set(pluginId, command, store),
  get: (commandId: string) => get(pluginId, commandId, store),
  remove: (commandId: string) => remove(pluginId, commandId, store),
  onChange: (handler: Parameters<typeof onChange>[0]) =>
    onChange(handler, store),
  onKeyChange: (key: string, handler: Parameters<typeof onKeyChange>[1]) =>
    onKeyChange(key, handler, store),
  entries: () => entries(store),
  keys: () => keys(store),
  values: () => values(store),
  save: () => save(store),
})

/**
 * Set a given command in the database.
 */
export const set = async (
  pluginId: Plugin["id"],
  command: Command,
  store = new Store(DB_STORE_PATH),
) => {
  const { scope, name } = parsePluginId(pluginId)
  await store.set(`${scope}.${name}.${command.id}`, command)
}

/**
 * Get a given command from the database.
 */
export const get = async (
  pluginId: Plugin["id"],
  commandId: string,
  store = new Store(DB_STORE_PATH),
) => {
  const { scope, name } = parsePluginId(pluginId)
  const command = await store.get<Command>(`${scope}.${name}.${commandId}`)
  return command
}

/**
 * Remove a given command from the database.
 */
export const remove = async (
  pluginId: Plugin["id"],
  commandId: string,
  store = new Store(DB_STORE_PATH),
) => {
  const { scope, name } = parsePluginId(pluginId)
  await store.delete(`${scope}.${name}.${commandId}`)
}

/**
 * Save the database to disk.
 */
export const save = async (store = new Store(DB_STORE_PATH)) => {
  await store.save()
}

const parseKey = (key: string) => {
  const [scope, name, ...id] = key.split(".")
  return { scope, name, commandId: id.join(".") }
}

export const onChange = async (
  handler: (
    plugin: { scope: string; name: string; id: Plugin["id"] },
    command: Command | null,
  ) => void,
  store = new Store(DB_STORE_PATH),
) => {
  await store.onChange<Command>((key, value) => {
    const { scope, name } = parseKey(key)
    const id = createPluginId(scope, name)
    handler({ scope, name, id }, value)
  })
}

export const onKeyChange = async (
  key: string,
  handler: (command: Command | null) => void,
  store = new Store(DB_STORE_PATH),
) => {
  await store.onKeyChange<Command>(key, handler)
}

export const entries = async (store = new Store(DB_STORE_PATH)) => {
  const entries = await store.entries<Command>()
  return entries
}

export const keys = async (store = new Store(DB_STORE_PATH)) => {
  const keys = await store.keys()
  return keys
}

export const values = async (store = new Store(DB_STORE_PATH)) => {
  const values = await store.values<Command>()
  return values
}

export type SearchQuery = {
  query: string
  offset: number
  limit: number
}

export const search = (query: SearchQuery) =>
  invoke<Command[]>("db_search", query)

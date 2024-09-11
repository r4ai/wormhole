import { invoke } from "@tauri-apps/api/core"
import { Store } from "@tauri-apps/plugin-store"
import { parsePluginId } from "./core.js"
import type { Command } from "./schema.js"

export const DB_STORE_PATH = "db.bin"

/**
 * Insert a given command into the database.
 */
export const insert = async (
  pluginId: string,
  command: Command,
  store = new Store(DB_STORE_PATH),
) => {
  const { scope, name } = parsePluginId(pluginId)
  await store.set(`${scope}.${name}.${command.id}`, command)
}

/**
 * Remove a given command from the database.
 */
export const remove = async (
  pluginId: string,
  commandId: string,
  store = new Store(DB_STORE_PATH),
) => {
  const { scope, name } = parsePluginId(pluginId)
  await store.delete(`${scope}.${name}.${commandId}`)
}

/**
 * Save the database to disk.
 */
export const save = async () => {
  const store = new Store(DB_STORE_PATH)
  await store.save()
}

export type SearchQuery = {
  query: string
  offset: number
  limit: number
}

export const search = (query: SearchQuery) =>
  invoke<Command[]>("db_search", query)

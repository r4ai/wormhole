import { Store } from "@tauri-apps/plugin-store"
import { parsePluginId } from "./core.js"
import type { Plugin } from "./schema.js"

export const SETTINGS_STORE_PATH = "settings.bin"

export const initSettings = <Schema extends Record<string, unknown>>(
  pluginId: Plugin["id"],
  store = new Store(SETTINGS_STORE_PATH),
) => ({
  get: <Key extends keyof Schema>(key: Key) =>
    get<Schema, Key>(pluginId, key, store),
  set: <Key extends keyof Schema>(key: Key, value: Schema[Key]) =>
    set<Schema, Key>(pluginId, key, value, store),
  entries: () => entries<Schema>(store),
  keys: () => keys<Schema>(store),
  values: () => values<Schema>(store),
  save: () => save(store),
})

const get = async <
  Schema extends Record<string, unknown>,
  Key extends keyof Schema,
>(
  pluginId: Plugin["id"],
  key: Key,
  store = new Store(SETTINGS_STORE_PATH),
) => {
  const { scope, name } = parsePluginId(pluginId)
  const value = await store.get<Schema[Key]>(
    `${scope}.${name}.${key.toString()}`,
  )
  return value
}

const set = async <
  Schema extends Record<string, unknown>,
  Key extends keyof Schema,
>(
  pluginId: Plugin["id"],
  key: Key,
  value: Schema[Key],
  store = new Store(SETTINGS_STORE_PATH),
) => {
  const { scope, name } = parsePluginId(pluginId)
  await store.set(`${scope}.${name}.${key.toString()}`, value)
}

const entries = <Schema extends Record<string, unknown>>(
  store = new Store(SETTINGS_STORE_PATH),
) =>
  store.entries<Schema[keyof Schema]>() as Promise<
    [keyof Schema, Schema[keyof Schema]][]
  >

const keys = <Schema extends Record<string, unknown>>(
  store = new Store(SETTINGS_STORE_PATH),
) => store.keys() as Promise<(keyof Schema)[]>

const values = <Schema extends Record<string, unknown>>(
  store = new Store(SETTINGS_STORE_PATH),
) => store.values<Schema[keyof Schema]>()

const save = (store = new Store(SETTINGS_STORE_PATH)) => store.save()

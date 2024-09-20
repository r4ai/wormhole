import { Store } from "@tauri-apps/plugin-store"
import { parsePluginId } from "./core.js"
import type { Plugin } from "./schema.js"

export const SETTINGS_STORE_PATH = "settings.bin"

export const WORMHOLE_CORE_PLUGIN_ID = "@wormhole/core"
export const WORMHOLE_SHORTCUTS_PLUGIN_ID = "@wormhole/shortcuts"

export const initSettings = <
  PluginID extends Plugin["id"],
  Schema extends Record<
    string,
    unknown
  > = PluginID extends typeof WORMHOLE_CORE_PLUGIN_ID
    ? WormholeCoreSettings
    : PluginID extends typeof WORMHOLE_SHORTCUTS_PLUGIN_ID
      ? WormholeShortcutsSettings
      : Record<string, unknown>,
>(
  pluginId: PluginID,
  store = new Store(SETTINGS_STORE_PATH),
) => ({
  get: <Key extends keyof Schema>(key: Key) =>
    get<Schema, Key>(pluginId, key, store),
  set: <Key extends keyof Schema>(key: Key, value: Schema[Key]) =>
    set<Schema, Key>(pluginId, key, value, store),
  entries: () => entries<Schema>(pluginId, store),
  keys: () => keys<Schema>(pluginId, store),
  values: () => values<Schema>(pluginId, store),
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

const entries = async <Schema extends Record<string, unknown>>(
  pluginId: Plugin["id"],
  store = new Store(SETTINGS_STORE_PATH),
) => {
  const { scope, name } = parsePluginId(pluginId)
  const entries = await store.entries<Schema[keyof Schema]>()
  return entries
    .filter(([key]) => key.startsWith(`${scope}.${name}.`))
    .map(([key, value]) => [key.replace(`${scope}.${name}.`, ""), value]) as [
    keyof Schema,
    Schema[keyof Schema],
  ][]
}

const keys = async <Schema extends Record<string, unknown>>(
  pluginId: Plugin["id"],
  store = new Store(SETTINGS_STORE_PATH),
) => {
  const { scope, name } = parsePluginId(pluginId)
  const keys = await store.keys()
  return keys
    .filter((key) => key.startsWith(`${scope}.${name}.`))
    .map((key) => key.replace(`${scope}.${name}.`, "")) as (keyof Schema)[]
}

const values = async <Schema extends Record<string, unknown>>(
  pluginId: Plugin["id"],
  store = new Store(SETTINGS_STORE_PATH),
) => {
  const { scope, name } = parsePluginId(pluginId)
  const entries = await store.entries<Schema[keyof Schema]>()
  return entries
    .filter(([key]) => key.startsWith(`${scope}.${name}.`))
    .map(([, value]) => value)
}

const save = (store = new Store(SETTINGS_STORE_PATH)) => store.save()

export type WormholeCoreSettings = {
  plugins: Plugin[]
}

export const defaultWormholeCoreSettings = {
  plugins: [],
} as const satisfies WormholeCoreSettings

export type WormholeShortcutsSettings = {
  "toggle-window": Shortcut
}

export const defaultWormholeShortcutsSettings = {
  "toggle-window": "Option+Space",
} as const satisfies WormholeShortcutsSettings

type OptionModifier = "Option"
type ControlModifier = "Ctrl"
type SuperModifier = "Cmd"
type ShiftModifier = "Shift"
type SuperOrControl = "CmdOrCtrl"
type Modifier =
  | OptionModifier
  | ControlModifier
  | SuperModifier
  | ShiftModifier
  | SuperOrControl
type AlphabetKey =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z"
type NumberKey = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
type NumpadKey =
  | "Numpad0"
  | "Numpad1"
  | "Numpad2"
  | "Numpad3"
  | "Numpad4"
  | "Numpad5"
  | "Numpad6"
  | "Numpad7"
  | "Numpad8"
  | "Numpad9"
  | "NumpadAdd"
  | "NumpadDecimal"
  | "NumpadDivide"
  | "NumpadEqual"
  | "NumpadMultiply"
  | "NumpadSubtract"
type FnKey =
  | "F1"
  | "F2"
  | "F3"
  | "F4"
  | "F5"
  | "F6"
  | "F7"
  | "F8"
  | "F9"
  | "F10"
  | "F11"
  | "F12"
  | "F13"
  | "F14"
  | "F15"
  | "F16"
  | "F17"
  | "F18"
  | "F19"
  | "F20"
  | "F21"
  | "F22"
  | "F23"
  | "F24"
type Key =
  | "Backquote"
  | "Backslash"
  | "BracketLeft"
  | "BracketRight"
  | "Comma"
  | "Equal"
  | "Minus"
  | "Period"
  | "Quote"
  | "Semicolon"
  | "Slash"
  | "Backspace"
  | "CapsLock"
  | "Enter"
  | "Space"
  | "Tab"
  | "Delete"
  | "End"
  | "Home"
  | "Insert"
  | "PageDown"
  | "PageUp"
  | "PrintScreen"
  | "ScrollLock"
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "ArrowUp"
  | "NumLock"
  | "Esc"
  | "AudioVolumeDown"
  | "AudioVolumeUp"
  | "AudioVolumeMute"
  | "MediaPlay"
  | "MediaPause"
  | "MediaPlayPause"
  | "MediaStop"
  | "MediaTrackNext"
  | "MediaTrackPrev"
  | AlphabetKey
  | NumberKey
  | NumpadKey
  | FnKey
type Modifiers =
  | Modifier
  | `${Modifier}+${Modifier}`
  | `${Modifier}+${Modifier}+${Modifier}`
  | `${Modifier}+${Modifier}+${Modifier}+${Modifier}`
type Shortcut = Key | `${Modifiers}+${Key}`

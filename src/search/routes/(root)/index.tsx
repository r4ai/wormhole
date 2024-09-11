import { Store } from "@tauri-apps/plugin-store"
import { createEffect, createSignal, type Component } from "solid-js"

export const Root: Component = () => {
  const [settings, setSettings] = createSignal<unknown>(null)
  const [db, setDb] = createSignal<unknown>(null)

  createEffect(async () => {
    {
      const store = new Store("settings.bin")
      const keys = await store.keys()
      const entries: Record<string, unknown> = {}
      for (const key of keys) {
        entries[key] = await store.get(key)
      }
      setSettings(entries)
    }

    {
      const store = new Store("db.bin")
      const keys = await store.keys()
      const entries: Record<string, unknown> = {}
      for (const key of keys) {
        entries[key] = await store.get(key)
      }
      setDb(entries)
    }
  })

  return (
    <pre>{JSON.stringify({ settings: settings(), db: db() }, null, 2)}</pre>
  )
}

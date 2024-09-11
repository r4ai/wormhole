import { Store } from "@tauri-apps/plugin-store"
import type { Command } from "@wormhole/api/schema"

const DB_STORE_PATH = "db.bin"

export const insert = async (command: Command) => {
  const store = new Store(DB_STORE_PATH)
  await store.set(`wormhole.application.${command.id}`, command)
}

export const remove = async (id: string) => {
  const store = new Store(DB_STORE_PATH)
  await store.delete(`wormhole.application.${id}`)
}

export const save = async () => {
  const store = new Store(DB_STORE_PATH)
  await store.save()
}

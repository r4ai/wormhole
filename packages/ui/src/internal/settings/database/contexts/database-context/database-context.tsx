import * as db from "@wormhole/api/db"
import type { Command, Plugin } from "@wormhole/api/schema"
import {
  type Component,
  type JSX,
  type Resource,
  createContext,
  createResource,
  createSignal,
  mergeProps,
  useContext,
} from "solid-js"

export type DatabaseContext = {
  commands: Resource<Command[]>
  refetch: (
    info?: unknown,
  ) => Command[] | Promise<Command[] | undefined> | null | undefined
  set: (pluginId: Plugin["id"], command: Command) => void
  remove: (pluginId: Plugin["id"], commandId: string) => void
  search: (query: string) => void
}

export const DatabaseContext = createContext<DatabaseContext>()

type Operation =
  | {
      type: "set"
      pluginId: Plugin["id"]
      command: Command
    }
  | {
      type: "remove"
      pluginId: Plugin["id"]
      commandId: string
    }
  | {
      type: "search"
      query: string
    }
  | {
      type: "query"
    }

export type DatabaseProviderProps = {
  set?: typeof db.set
  remove?: typeof db.remove
  search?: typeof db.search
  values?: typeof db.values
  children?: JSX.Element
}

export const DatabaseProvider: Component<DatabaseProviderProps> = (props) => {
  const local = mergeProps(
    {
      set: db.set,
      remove: db.remove,
      search: db.search,
      values: db.values,
    },
    props,
  )

  const [operation, setOperation] = createSignal<Operation>({ type: "query" })
  const [commands, { refetch }] = createResource(operation, async (query) => {
    switch (query.type) {
      case "set": {
        await local.set(query.pluginId, query.command)
        const commands = await local.values()
        return commands
      }
      case "remove": {
        await local.remove(query.pluginId, query.commandId)
        const commands = await local.values()
        return commands
      }
      case "search": {
        const commands =
          query.query.length === 0
            ? await local.values()
            : await local.search({
                offset: 0,
                limit: 3000,
                query: query.query,
              })
        return commands
      }
    }
    const commands = await local.values()
    return commands
  })

  const set = (pluginId: Plugin["id"], command: Command) =>
    setOperation({ type: "set", pluginId, command })
  const remove = (pluginId: Plugin["id"], commandId: string) =>
    setOperation({ type: "remove", pluginId, commandId })
  const search = (query: string) => setOperation({ type: "search", query })

  return (
    <DatabaseContext.Provider
      value={{
        commands,
        refetch,
        set,
        remove,
        search,
      }}
    >
      {props.children}
    </DatabaseContext.Provider>
  )
}

export const useDatabase = () => {
  const databaseContext = useContext(DatabaseContext)
  if (databaseContext === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider")
  }
  return databaseContext
}

import {
  type Table,
  createSolidTable,
  getCoreRowModel,
} from "@tanstack/solid-table"
import type { Command } from "@wormhole/api/schema"
import { type Component, type JSX, createContext, useContext } from "solid-js"
import { useDatabase } from "../../contexts/database-context"

export type TableContext = {
  table: Table<Command>
}

export const TableContext = createContext<TableContext>()

export type TableProviderProps = {
  children?: JSX.Element
}

export const TableProvider: Component<TableProviderProps> = (props) => {
  const { commands } = useDatabase()

  const table = createSolidTable({
    get data() {
      return commands() ?? []
    },
    columns: [
      {
        accessorKey: "action",
        accessorFn: (row) => row.action,
        header: "Action",
      },
      {
        accessorKey: "aliases",
        accessorFn: (row) => row.aliases,
        header: "Aliases",
      },
      {
        accessorKey: "id",
        accessorFn: (row) => row.id,
        header: "ID",
      },
      {
        accessorKey: "kind",
        accessorFn: (row) => row.kind,
        header: "Kind",
      },
      {
        accessorKey: "name",
        accessorFn: (row) => row.name,
        header: "Name",
      },
      {
        accessorKey: "pluginId",
        accessorFn: (row) => row.pluginId,
        header: "Plugin ID",
      },
      {
        accessorKey: "subActions",
        accessorFn: (row) => row.subActions,
        header: "Sub Actions",
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnVisibility: {
        action: false,
        subActions: false,
      },
      columnOrder: ["name", "pluginId", "kind", "aliases", "id"],
      sorting: [{ id: "pluginId", desc: false }],
    },
  })

  return (
    <TableContext.Provider value={{ table }}>
      {props.children}
    </TableContext.Provider>
  )
}

export const useTable = () => {
  const context = useContext(TableContext)
  if (!context) {
    throw new Error("useTable must be used within a TableProvider")
  }
  return context
}

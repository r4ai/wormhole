import { flexRender } from "@tanstack/solid-table"
import { css } from "@wormhole/styled-system/css"
import { grid } from "@wormhole/styled-system/patterns"
import { type Component, For } from "solid-js"
import { useTable } from "./context"

export type TableTableProps = {
  class?: string
}

export const TableTable: Component<TableTableProps> = (props) => {
  const { table } = useTable()

  return (
    <table
      class={grid({
        gridTemplateColumns: "5",
      })}
    >
      <thead
        class={grid({
          position: "sticky",
          top: "16",
          background: "background",
          borderBottomWidth: "1px",
          padding: "2",
          gridTemplateColumns: "subgrid",
          gridColumn: "1 / -1",
          textAlign: "left",
        })}
      >
        <For each={table.getHeaderGroups()}>
          {(headerGroup) => (
            <tr
              class={grid({
                gridTemplateColumns: "subgrid",
                gridColumn: "1 / -1",
              })}
            >
              <For each={headerGroup.headers}>
                {(header) => (
                  <th class={css({ display: "block" })}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                )}
              </For>
            </tr>
          )}
        </For>
      </thead>
      <tbody
        class={grid({
          gridTemplateColumns: "subgrid",
          gridColumn: "1 / -1",
          paddingX: "2",
        })}
      >
        <For each={table.getRowModel().rows}>
          {(row) => (
            <tr
              class={grid({
                gridTemplateColumns: "subgrid",
                gridColumn: "1 / -1",
              })}
            >
              <For each={row.getVisibleCells()}>
                {(cell) => (
                  <td class={css({ display: "block" })}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  )
}

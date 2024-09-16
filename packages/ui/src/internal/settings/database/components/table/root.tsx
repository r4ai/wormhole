import { vstack } from "@wormhole/styled-system/patterns"
import type { Component, JSX } from "solid-js"
import { TableProvider } from "./context"

export type TableRootProps = {
  children?: JSX.Element
}

export const TableRoot: Component<TableRootProps> = (props) => {
  return (
    <TableProvider>
      <div class={vstack({ gap: 0 })}>{props.children}</div>
    </TableProvider>
  )
}

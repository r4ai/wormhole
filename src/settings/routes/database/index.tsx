import { css } from "@wormhole/styled-system/css"
import * as Table from "@wormhole/ui/internal/settings/database/components/table"

export const Database = () => {
  return (
    <div class={css({ marginX: "6", marginY: "4" })}>
      <h1 class={css({ fontSize: "2xl", fontWeight: "bold" })}>Database</h1>
      <Table.Root>
        <Table.Controller />
        <Table.Table />
      </Table.Root>
    </div>
  )
}

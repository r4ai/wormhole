import { Select, SelectContent, SelectItem, SelectTrigger } from "@/ui/select"
import { TextField } from "@kobalte/core/text-field"
import { css, cx } from "@wormhole/styled-system/css"
import { flex } from "@wormhole/styled-system/patterns"
import type { JsxStyleProps } from "@wormhole/styled-system/types"
import { type Component, splitProps } from "solid-js"
import { useDatabase } from "../../contexts/database-context"
import { useTable } from "./context"

export type TableControllerProps = {
  class?: string
  css?: JsxStyleProps
}

export const TableController: Component<TableControllerProps> = (props) => {
  const [local] = splitProps(props, ["class", "css"])

  return (
    <div
      class={cx(
        css(
          flex.raw({
            position: "sticky",
            top: "0",
            paddingTop: "4",
            height: "16",
            width: "full",
            background: "background",
            alignItems: "center",
            justifyContent: "space-between",
          }),
          local.css,
        ),
        local.class,
      )}
    >
      <div>
        <SearchInput />
      </div>
      <div>
        <PropertiesSelector />
      </div>
    </div>
  )
}

const SearchInput = () => {
  const { search } = useDatabase()

  return (
    <TextField onChange={(query) => search(query)}>
      <TextField.Input
        placeholder="Search names..."
        class={css({
          paddingX: "2",
          paddingY: "1",
          rounded: "md",
          borderWidth: "1px",
          outlineOffset: "1",
        })}
      />
    </TextField>
  )
}

type Property = {
  id: string
  label: string
}

const PropertiesSelector = () => {
  const { table } = useTable()

  return (
    <Select<Property>
      multiple
      value={table.getVisibleFlatColumns().map((col) => ({
        id: col.id,
        label: col.columnDef.header?.toString() ?? "",
      }))}
      onChange={(selected) => {
        table.setColumnVisibility((prev) => ({
          ...Object.fromEntries(
            Object.entries(prev).map(([key]) => [key, false]),
          ),
          ...Object.fromEntries(selected.map((col) => [col.id, true])),
        }))
      }}
      options={table.getAllColumns().map((col) => ({
        id: col.id,
        label: col.columnDef.header?.toString() ?? "",
      }))}
      optionValue="id"
      optionTextValue="label"
      placeholder="Properties"
      itemComponent={(props) => (
        <SelectItem item={props.item}>{props.item.rawValue.label}</SelectItem>
      )}
    >
      <SelectTrigger>Properties</SelectTrigger>
      <SelectContent />
    </Select>
  )
}

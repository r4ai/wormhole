import type { Meta, StoryObj } from "storybook-solidjs"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

const meta = {
  title: "UI/Select",
  component: (props: Parameters<typeof Select>[0]) => (
    <Select
      itemComponent={(props) => (
        <SelectItem item={props.item}>{String(props.item.rawValue)}</SelectItem>
      )}
      {...props}
    >
      <SelectTrigger>
        <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  ),
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Select>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    options: ["Apple", "Banana", "Cherry", "Date", "Elderberry"],
    placeholder: "Select a fruit...",
  },
}

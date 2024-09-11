import type { Meta, StoryObj } from "storybook-solidjs"

import { Skeleton, type SkeletonProps } from "./skeleton"

const meta = {
  title: "UI/Skelton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Skeleton>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    style: {
      height: "80px",
      width: "240px",
    },
  } satisfies SkeletonProps,
}

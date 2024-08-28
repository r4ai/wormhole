import type { Meta, StoryObj } from "storybook-solidjs"

import { Button, button } from "./button"

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Button",
  },
  argTypes: {
    variant: {
      options: button.variantMap.variant,
      control: { type: "select" },
    },
    size: {
      options: button.variantMap.size,
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof Button>
export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: "primary",
    size: "md",
  },
}

export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "md",
  },
}

export const Outline: Story = {
  args: {
    children: "Button",
    variant: "outline",
    size: "md",
  },
}

export const Ghost: Story = {
  args: {
    children: "Button",
    variant: "ghost",
    size: "md",
  },
}

export const Link: Story = {
  args: {
    children: "Button",
    variant: "link",
    size: "md",
  },
}

export const Large: Story = {
  args: {
    children: "Button",
    variant: "outline",
    size: "lg",
  },
}

export const Medium: Story = {
  args: {
    children: "Button",
    variant: "outline",
    size: "md",
  },
}

export const Small: Story = {
  args: {
    children: "Button",
    variant: "outline",
    size: "sm",
  },
}

export const Icon: Story = {
  args: {
    children: "🚀",
    variant: "outline",
    size: "icon",
  },
}

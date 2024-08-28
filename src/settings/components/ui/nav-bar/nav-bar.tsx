import { A } from "@solidjs/router"
import { css, sva } from "@wormhole/styled-system/css"
import { Button } from "@wormhole/ui"
import { BlocksIcon, CodeIcon, InfoIcon, SettingsIcon } from "lucide-solid"
import type { Component, JSX } from "solid-js"

export const navbar = sva({
  slots: ["root"],
  base: {
    root: {
      height: "full",
      minWidth: "48",
      display: "flex",
      flexDirection: "column",
      borderRightWidth: "1px",
    },
  },
})

export type NavBarItemProps = {
  href: string
  children?: JSX.Element
}

export const NavBarItem: Component<NavBarItemProps> = (props) => {
  return (
    <Button
      as={A}
      href={props.href}
      variant="ghost"
      class={css({
        width: "full",
        justifyContent: "start !important",
        alignItems: "center",
        gap: "2",
        fontSize: "sm",
      })}
    >
      {props.children}
    </Button>
  )
}

export const NavBar: Component = () => {
  const classes = navbar()
  return (
    <nav class={classes.root}>
      <NavBarItem href="/general">
        <SettingsIcon size={20} />
        General
      </NavBarItem>
      <NavBarItem href="/plugins">
        <BlocksIcon size={20} />
        Plugins
      </NavBarItem>
      <NavBarItem href="/advanced">
        <CodeIcon size={20} />
        Advanced
      </NavBarItem>
      <NavBarItem href="/about">
        <InfoIcon size={20} />
        About
      </NavBarItem>
    </nav>
  )
}

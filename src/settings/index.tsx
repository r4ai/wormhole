import { css } from "@wormhole/styled-system/css"
import "./styles/global.css"

import { Router } from "@solidjs/router"
import { Button } from "@wormhole/ui"
import type { Component, JSX } from "solid-js"
import { render } from "solid-js/web"

type LayoutProps = {
  children?: JSX.Element
}

const Layout: Component<LayoutProps> = (props) => {
  return (
    <div>
      <h1 class="">Settings</h1>
      <div class={css({ spaceX: "4" })}>
        <Button>Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div>{props.children}</div>
    </div>
  )
}

const App = () => <Router root={Layout} />

// biome-ignore lint/style/noNonNullAssertion: #root is always present in the DOM
render(App, document.getElementById("root")!)

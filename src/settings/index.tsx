import "./styles/global.css"

import { Router } from "@solidjs/router"
import type { Component, JSX } from "solid-js"
import { render } from "solid-js/web"

type LayoutProps = {
  children?: JSX.Element
}

const Layout: Component<LayoutProps> = (props) => {
  return (
    <div>
      <h1>Settings</h1>
      <div>{props.children}</div>
    </div>
  )
}

const App = () => <Router root={Layout} />

// biome-ignore lint/style/noNonNullAssertion: #root is always present in the DOM
render(App, document.getElementById("root")!)

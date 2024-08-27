import { render } from "solid-js/web"
import { Router } from "@solidjs/router"
import { Component, JSX } from "solid-js"

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

const App = () => <Router root={Layout}></Router>

render(App, document.getElementById("root")!)

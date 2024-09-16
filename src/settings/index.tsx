import { css } from "@wormhole/styled-system/css"
import "./styles/global.css"

import { Route, Router } from "@solidjs/router"
import { DatabaseProvider } from "@wormhole/ui/internal/settings/database/contexts/database-context"
import type { Component, JSX } from "solid-js"
import { render } from "solid-js/web"
import { NavBar } from "./components/ui/nav-bar"
import { About } from "./routes/about"
import { Database } from "./routes/database"

type LayoutProps = {
  children?: JSX.Element
}

const Layout: Component<LayoutProps> = (props) => {
  return (
    <DatabaseProvider>
      <div
        class={css({
          height: "full",
          display: "flex",
          flexDir: "row",
        })}
      >
        <NavBar />
        <main
          class={css({
            width: "full",
            height: "full",
            overflowY: "auto",
          })}
        >
          {props.children}
        </main>
      </div>
    </DatabaseProvider>
  )
}

const App = () => (
  <Router base="/src/settings" root={Layout}>
    <Route path="/about" component={About} />
    <Route path="/database" component={Database} />
  </Router>
)

// biome-ignore lint/style/noNonNullAssertion: #root is always present in the DOM
render(App, document.getElementById("root")!)

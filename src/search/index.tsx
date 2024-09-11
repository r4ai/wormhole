import "./styles/global.css"
import { HashRouter, Route } from "@solidjs/router"
import { SearchFooter, SearchInput, SearchRoot } from "@wormhole/ui/internal"
import { type Component, type JSX, createEffect } from "solid-js"
import { render } from "solid-js/web"
import { initPluginsListeners } from "./api/plugins"
import { Root } from "./routes/(root)"

type LayoutProps = {
  children?: JSX.Element
}

const Layout: Component<LayoutProps> = (props) => {
  createEffect(async () => {
    const unlisten = await initPluginsListeners()
    return () => unlisten()
  })

  return (
    <SearchRoot>
      <SearchInput />
      {props.children}
      <SearchFooter />
    </SearchRoot>
  )
}

const App = () => (
  <HashRouter base="/src/search" root={Layout}>
    <Route path="/" component={Root} />
  </HashRouter>
)

// biome-ignore lint/style/noNonNullAssertion: #root is always present in the DOM
render(App, document.getElementById("root")!)

import "./styles/global.css"
import { HashRouter, Route } from "@solidjs/router"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { register, unregisterAll } from "@tauri-apps/plugin-global-shortcut"
import * as log from "@tauri-apps/plugin-log"
import {
  defaultWormholeShortcutsSettings,
  initSettings,
} from "@wormhole/api/settings"
import { SearchFooter, SearchInput, SearchRoot } from "@wormhole/ui/internal"
import { type Component, type JSXElement, onCleanup, onMount } from "solid-js"
import { render } from "solid-js/web"
import { initPluginsListeners } from "./api/plugins"
import { Root } from "./routes/(root)"

const registerGlobalShortcuts = async () => {
  await unregisterAll()

  const { get } = initSettings("@wormhole/shortcuts")

  log.info("Registering global shortcuts...")
  console.log("Registering global shortcuts...")

  const toggleWindowShortcut =
    (await get("toggle-window")) ??
    defaultWormholeShortcutsSettings["toggle-window"]
  await register(toggleWindowShortcut, async (event) => {
    if (event.state !== "Released") return
    const window = getCurrentWindow()
    const isVisible = await window.isVisible()
    if (isVisible) {
      log.info("Hiding window")
      await window.hide()
    } else {
      log.info("Showing window")
      await window.center()
      await window.show()
    }
  })

  log.info("Registered global shortcuts")
  console.log("Registered global shortcuts")

  return unregisterAll
}

type LayoutProps = {
  children?: JSXElement
}

const Layout: Component<LayoutProps> = (props) => {
  onMount(async () => {
    const unlisten = await initPluginsListeners()
    const unregister = await registerGlobalShortcuts()
    onCleanup(async () => {
      unlisten()
      await unregister()
    })
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

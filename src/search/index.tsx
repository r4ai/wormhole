import "./styles/global.css"
import { Router } from "@solidjs/router"
import { render } from "solid-js/web"
import { initPluginsListeners } from "./api/plugins"

const App = () => <Router />

window.addEventListener("beforeunload", await initPluginsListeners())

// biome-ignore lint/style/noNonNullAssertion: #root is always present in the DOM
render(App, document.getElementById("root")!)

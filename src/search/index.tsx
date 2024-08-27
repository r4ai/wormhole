import "./styles/global.css"
import { Router } from "@solidjs/router"
import { render } from "solid-js/web"

const App = () => <Router />

// biome-ignore lint/style/noNonNullAssertion: #root is always present in the DOM
render(App, document.getElementById("root")!)

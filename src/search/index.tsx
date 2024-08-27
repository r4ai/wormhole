import "./styles/global.css"

import { render } from "solid-js/web"
import { Router } from "@solidjs/router"

const App = () => <Router></Router>

render(App, document.getElementById("root")!)

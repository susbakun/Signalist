import store from "@/app/store"
import ReactDOM from "react-dom/client"
import "react-loading-skeleton/dist/skeleton.css"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import "tippy.js/dist/svg-arrow.css"
import App from "./App.tsx"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
)

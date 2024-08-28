import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { injectStore } from "./config/api";
import store from "./config/store";
import { AuthProvider } from "./context/AuthProvider";
import "./index.css";

injectStore(store);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <AuthProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </AuthProvider>
);

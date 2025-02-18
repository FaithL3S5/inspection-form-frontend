import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { Provider as StyleProvider } from "./components/ui/provider.tsx";
import { store } from "./store/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyleProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </StyleProvider>
  </StrictMode>
);

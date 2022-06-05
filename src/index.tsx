import React from "react";
import "./index.css";
import "tailwindcss/tailwind.css";
import "antd/dist/antd.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import store from "./store";
import { Provider } from "react-redux";
import { AppContext } from "./reducer";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AppContext>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </AppContext>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

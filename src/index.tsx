// index.tsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App"


// Import DAppProvider
import { DAppProvider } from "@usedapp/core";

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={{}}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

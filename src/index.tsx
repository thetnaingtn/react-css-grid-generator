import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import { GlobalStyles } from "./global-styles";

const container = document.getElementById("root");
if (!container) throw new Error("Root container missing");
createRoot(container).render(
  <StrictMode>
    <GlobalStyles />
    <App />
  </StrictMode>
);

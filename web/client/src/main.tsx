import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./locales/i18.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);

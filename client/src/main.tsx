import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./hooks/use-theme";

const root = createRoot(document.getElementById("root")!);
root.render(
  React.createElement(HelmetProvider, null,
    React.createElement(ThemeProvider, null, 
      React.createElement(App, null)
    )
  )
);

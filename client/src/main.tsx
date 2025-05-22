import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./hooks/use-theme";
import { initPerformanceMonitoring } from "./lib/performance";

// Initialize performance monitoring
initPerformanceMonitoring();

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

const root = createRoot(document.getElementById("root")!);
root.render(
  React.createElement(HelmetProvider, null,
    React.createElement(ThemeProvider, null, 
      React.createElement(App, null)
    )
  )
);

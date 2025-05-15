import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Layout from "@/components/layout";

function Router() {
  return React.createElement(
    Layout,
    null,
    React.createElement(Switch, null,
      React.createElement(Route, { path: "/", component: Home }),
      React.createElement(Route, { component: NotFound })
    )
  );
}

function App() {
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(
      TooltipProvider,
      null,
      React.createElement(Toaster, null),
      React.createElement(Router, null)
    )
  );
}

export default App;

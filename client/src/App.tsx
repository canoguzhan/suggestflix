import React, { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Favorites from "@/pages/favorites";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import PrivacyPolicyPage from "@/pages/privacy-policy";
import TermsPage from "@/pages/terms";
import BlogPage from "@/pages/blog";
import Layout from "@/components/layout";
import { trackPageView } from "@/lib/analytics";

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    trackPageView(location);
  }, [location]);

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/favorites" component={Favorites} />
        <Route path="/about" component={AboutPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/privacy-policy" component={PrivacyPolicyPage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/blog" component={BlogPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

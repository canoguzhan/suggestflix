import React, { useEffect, Suspense, lazy } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout";
import { trackPageView } from "@/lib/analytics";

// Lazy load pages
const Home = lazy(() => import("@/pages/home"));
const Favorites = lazy(() => import("@/pages/favorites"));
const AboutPage = lazy(() => import("@/pages/about"));
const ContactPage = lazy(() => import("@/pages/contact"));
const PrivacyPolicyPage = lazy(() => import("@/pages/privacy-policy"));
const TermsPage = lazy(() => import("@/pages/terms"));
const BlogPage = lazy(() => import("@/pages/blog"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Loading component
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    trackPageView(location);
  }, [location]);

  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
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

import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "./pages/HomePage";
import CheckoutPage from "./pages/CheckoutPage";
import StoreLocatorPage from "./pages/StoreLocatorPage";

function Router() {
  const [cartItems] = useState([]); // todo: remove mock functionality - would use context or state management
  
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/checkout">
        <CheckoutPage cartItems={cartItems} deliveryType="delivery" />
      </Route>
      <Route path="/stores" component={StoreLocatorPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

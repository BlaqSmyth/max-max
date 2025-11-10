import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "./contexts/CartContext";
import NotFound from "@/pages/not-found";
import HomePage from "./pages/HomePage";
import CheckoutPage from "./pages/CheckoutPage";
import StoreLocatorPage from "./pages/StoreLocatorPage";
import AdminLogin from "./pages/AdminLogin";
import AdminProducts from "./pages/AdminProducts";
import { AdminLayout } from "./components/AdminLayout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/stores" component={StoreLocatorPage} />
      
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/products">
        <AdminLayout>
          <AdminProducts />
        </AdminLayout>
      </Route>
      <Route path="/admin">
        <AdminLayout>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome to Max & Max Admin CMS
            </p>
          </div>
        </AdminLayout>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;

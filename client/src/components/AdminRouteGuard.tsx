import { useEffect } from "react";
import { useLocation } from "wouter";

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    if (!token) {
      setLocation("/admin/login");
    }
  }, [token, setLocation]);

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-muted-foreground">Redirecting to login...</div>
      </div>
    );
  }

  return <>{children}</>;
}

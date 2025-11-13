import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export function useAdminAuth() {
  const [, setLocation] = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setLocation("/admin/login");
      setIsAuthenticated(false);
      setIsChecking(false);
    } else {
      setIsAuthenticated(true);
      setIsChecking(false);
    }
  }, [setLocation]);

  return { isChecking, isAuthenticated };
}

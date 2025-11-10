import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call login endpoint to get session token
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        // Save session token in localStorage
        localStorage.setItem("admin_token", token);
        toast({
          title: "Login successful",
          description: "Welcome to Admin CMS",
        });
        setLocation("/admin/products");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter the admin password to access the CMS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                data-testid="input-admin-password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              data-testid="button-admin-login"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Default password: admin123
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

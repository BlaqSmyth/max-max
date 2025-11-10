import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Package, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Package,
  },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("admin_token");
    if (!token && !location.startsWith("/admin/login")) {
      setLocation("/admin/login");
    }
  }, [location, setLocation]);

  const handleLogout = async () => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      // Call logout endpoint to invalidate token
      await fetch("/api/admin/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    localStorage.removeItem("admin_token");
    setLocation("/admin/login");
  };

  if (location === "/admin/login") {
    return <>{children}</>;
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-lg font-bold text-primary">
                Max & Max Admin
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <div className="mt-auto p-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
                data-testid="button-admin-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <h1 className="text-xl font-semibold">Admin CMS</h1>
            <div className="w-9" />
          </header>
          <main className="flex-1 overflow-auto p-6 bg-muted/20">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

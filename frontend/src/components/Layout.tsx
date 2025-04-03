
import React from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger, SidebarHeader, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Box, LayoutGrid, Package, PlusCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="flex justify-center items-center py-6">
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">LogiTrack</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className={cn(isActivePath("/") && "bg-primary/10 text-primary")}>
                      <Link to="/">
                        <LayoutGrid className="h-5 w-5" />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className={cn(isActivePath("/inventory") && "bg-primary/10 text-primary")}>
                      <Link to="/inventory">
                        <Box className="h-5 w-5" />
                        <span>Inventory</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className={cn(isActivePath("/add-item") && "bg-primary/10 text-primary")}>
                      <Link to="/add-item">
                        <PlusCircle className="h-5 w-5" />
                        <span>Add Item</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className={cn(isActivePath("/low-stock") && "bg-primary/10 text-primary")}>
                      <Link to="/low-stock">
                        <AlertCircle className="h-5 w-5" />
                        <span>Low Stock</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <SidebarTrigger className="lg:hidden" />
            <h1 className="text-2xl font-bold">{getPageTitle(location.pathname)}</h1>
            <div className="w-10" /> {/* Empty div for flex spacing */}
          </div>
          <main className="container mx-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

// Helper function to get page title from path
function getPageTitle(path: string): string {
  switch (path) {
    case "/":
      return "Dashboard";
    case "/inventory":
      return "Inventory";
    case "/add-item":
      return "Add New Item";
    case "/low-stock":
      return "Low Stock Alerts";
    default:
      return "LogiTrack";
  }
}

export default Layout;

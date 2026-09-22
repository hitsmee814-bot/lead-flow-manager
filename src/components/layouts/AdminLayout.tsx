import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "../Admin/admin-sidebar";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset>
        <main className="flex-1 bg-gray-50 p-6 overflow-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
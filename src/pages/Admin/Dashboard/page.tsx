"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/app/components/Admin/admin-sidebar"
import { AdminHeader } from "@/app/components/Admin/admin-header"

export default function AdminPage() {
    return (
        <SidebarProvider>
            <AdminHeader />

            <AdminSidebar />

            <main className="min-h-screen w-full pt-20">
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-[#0E40C7]">
                        Admin Dashboard
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Welcome to the Admin Dashboard
                    </p>
                </div>
            </main>
        </SidebarProvider>
    )
}
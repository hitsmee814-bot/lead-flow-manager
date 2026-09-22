"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/app/components/Admin/admin-sidebar"
import { AdminHeader } from "@/app/components/Admin/admin-header"
import { EnquiryList } from "../../components/Admin/Enquiries/EnquiryList"

export default function EnquiriesPage() {
    return (
        <SidebarProvider>
            <AdminHeader />
            <AdminSidebar />

            <main className="min-h-screen w-full pt-20">
                <div className="p-6">
                    <EnquiryList />
                </div>
            </main>
        </SidebarProvider>
    )
}
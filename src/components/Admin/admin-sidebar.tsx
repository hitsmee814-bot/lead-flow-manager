"use client"

import { useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Building2,
    UserRound,
    Package,
    CalendarCheck,
    Plane,
    MessageSquare,
    FileText,
    CreditCard,
    BarChart3,
    LogOut,
    Map,
    ChevronLeft,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"

const navigation = [
    {
        label: "OVERVIEW",
        items: [
            {
                title: "Dashboard",
                href: "/Admin",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        label: "MANAGEMENT",
        items: [
            {
                title: "Customers",
                href: "/Admin/Customers",
                icon: Users,
            },
            {
                title: "Suppliers",
                href: "/Admin/Suppliers",
                icon: Building2,
            },
            {
                title: "Agents",
                href: "/Admin/Agents",
                icon: UserRound,
            },
        ],
    },
    {
        label: "TRAVEL",
        items: [
            {
                title: "Packages",
                href: "/Admin/Packages",
                icon: Package,
            },
            {
                title: "Bookings",
                href: "/Admin/Bookings",
                icon: CalendarCheck,
            },
            {
                title: "Travels",
                href: "/Admin/Travels",
                icon: Plane,
            },
        ],
    },
    {
        label: "OPERATIONS",
        items: [
            {
                title: "Enquiries",
                href: "/Admin/Enquiries",
                icon: MessageSquare,
            },
            {
                title: "Itineraries",
                href: "/Admin/Itineraries",
                icon: Map,
            },
        ],
    },
    {
        label: "FINANCE",
        items: [
            {
                title: "Travel Invoices",
                href: "/Admin/TravelInvoices",
                icon: FileText,
            },
            {
                title: "Payments",
                href: "/Admin/Payments",
                icon: CreditCard,
            },
            {
                title: "Financial Reports",
                href: "/Admin/FinancialReports",
                icon: BarChart3,
            },
        ],
    },
]

export function AdminSidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const pathname = location.pathname;

    return (
        <Sidebar
            collapsible="none"
            className="bg-white border-r flex flex-col h-full"
        >

            {/* Sidebar Header */}
            <SidebarHeader className="h-14 border-b px-4">
                <div className="flex items-center justify-between h-full">
                    <span className="text-sm font-semibold text-gray-800">
                        Welcome
                    </span>

                    <button
                        type="button"
                        className="p-1 rounded-md hover:bg-gray-100"
                    >
                        <ChevronLeft className="h-4 w-4 text-gray-700" />
                    </button>
                </div>
            </SidebarHeader>

            {/* Sidebar Menu */}
            <SidebarContent className="flex-1 overflow-x-hidden">

                {navigation.map((group) => (
                    <SidebarGroup key={group.label}>

                        <div className="px-4 pt-5 pb-2">
                            <p className="text-xs font-semibold text-slate-400 tracking-wider">
                                {group.label}
                            </p>
                        </div>

                        <SidebarGroupContent>
                            <SidebarMenu className="px-2 space-y-1">

                                {group.items.map((item) => {
                                    const Icon = item.icon;

                                    const isActive =
                                    item.href === "/Admin"
                                        ? pathname === "/Admin"
                                        : pathname === item.href ||
                                        pathname.startsWith(item.href + "/")

                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <button
                                                    onClick={() => navigate(item.href)}
                                                    className={`
                                                        flex items-center gap-3 p-2 rounded-md w-full
                                                        ${
                                                            isActive
                                                                ? "text-[#FBAB18] bg-[#FBAB1810]"
                                                                : "text-[#3FB8FF] hover:bg-[#3FB8FF15]"
                                                        }
                                                    `}
                                                >
                                                    <Icon className="h-5 w-5 shrink-0" />

                                                    <span className="text-sm font-medium">
                                                        {item.title}
                                                    </span>
                                                </button>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}

                            </SidebarMenu>
                        </SidebarGroupContent>

                    </SidebarGroup>
                ))}

            </SidebarContent>

            {/* Logout */}
            <SidebarFooter className="border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("access_token")
                                    localStorage.removeItem("refresh_token")
                                    localStorage.removeItem("isLoggedIn")
                                    localStorage.removeItem("username")

                                    navigate("/Admin/login", { replace: true });
                                }}
                                className="flex items-center gap-3 p-2 text-red-500 hover:bg-red-50 w-full"
                            >
                                <LogOut className="h-5 w-5" />

                                <span className="text-sm font-medium">
                                    Logout
                                </span>
                            </button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

        </Sidebar>
    )
}
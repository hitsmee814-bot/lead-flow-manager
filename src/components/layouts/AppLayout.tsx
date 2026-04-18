"use client";

import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AppLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Itineraries", path: "/itineraries", icon: Map },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-14" : "w-64"
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}
      >
        {/* Header */}
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-between px-4"
          } h-14 border-b`}
        >
          {!collapsed && (
            <h2 className="text-sm font-semibold text-gray-800">
              Welcome
            </h2>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-1 mt-2 px-2">
          {menu.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${
                  collapsed ? "justify-center" : "gap-3 px-3"
                } py-2 rounded-md transition-all ${
                  active
                    ? "bg-[#00AFEF] text-white"
                    : "text-gray-700 hover:bg-[#00AFEF]/10 hover:text-[#00AFEF]"
                }`}
              >
                <Icon size={18} />

                {!collapsed && (
                  <span className="text-sm">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
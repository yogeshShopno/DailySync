"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  User,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ["admin", "staff"],
  },
  {
    label: "Tasks",
    href: "/task",
    icon: <ClipboardList className="h-5 w-5" />,
    roles: ["staff"],
  },
  {
    label: "Task Reports",
    href: "/task-report",
    icon: <BarChart3 className="h-5 w-5" />,
    roles: ["admin"],
  },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return <>{children}</>;

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user.role)
  );

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-theme-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-theme-gradient-start to-theme-gradient-end text-sm font-bold text-white shadow-md">
          DS
        </div>
        <div>
          <span className="text-sm font-bold text-white tracking-tight">
            DailySync
          </span>
         
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-theme-sidebar-fg-muted">
          Navigation
        </p>
        {filteredNavItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-theme-sidebar-active-bg text-theme-sidebar-active-fg"
                  : "text-theme-sidebar-fg hover:bg-theme-sidebar-hover-bg hover:text-white"
              }`}
            >
              <span className={active ? "text-theme-sidebar-active-fg" : "text-theme-sidebar-fg-muted group-hover:text-theme-sidebar-fg"}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {active && (
                <ChevronRight className="h-4 w-4 text-theme-sidebar-active-fg opacity-60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User card at bottom */}
      <div className="border-t border-theme-sidebar-border px-4 py-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-theme-sidebar-active-bg text-xs font-bold text-theme-sidebar-active-fg">
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user.name}
            </p>
            <div className="flex items-center gap-1.5">
              {user.role === "admin" ? (
                <Shield className="h-3 w-3 text-theme-warning" />
              ) : (
                <User className="h-3 w-3 text-theme-sidebar-fg-muted" />
              )}
              <span className="text-[11px] capitalize text-theme-sidebar-fg-muted">
                {user.role}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-theme-sidebar-fg-muted hover:bg-theme-error/10 hover:text-theme-error transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-theme-bg">
      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-theme-sidebar-bg border-r border-theme-sidebar-border z-30">
        {sidebarContent}
      </aside>

      {/* ─── Mobile overlay ─── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-theme-bg-overlay"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-theme-sidebar-bg border-r border-theme-sidebar-border shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* ─── Main content ─── */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-theme-border bg-theme-bg-surface/80 backdrop-blur-md px-4 py-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-1.5 text-theme-fg-muted hover:bg-theme-bg-surface-hover hover:text-theme-fg transition-colors cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-theme-gradient-start to-theme-gradient-end text-[10px] font-bold text-white">
              DS
            </div>
            <span className="text-sm font-bold text-theme-fg">DailySync</span>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

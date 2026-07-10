"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import LoginPanel from "../components/LoginPanel";
import Sidebar from "../components/Sidebar";
import {
  ClipboardList,
  BarChart3,
  Users,
  TrendingUp,
  ArrowRight,
  
  Shield,
  Calendar,
} from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPanel />;
  }

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
        {/* Welcome header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-theme-primary-bg px-3 py-1 text-xs font-semibold text-theme-primary-fg">
            <span>Welcome Back</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-theme-fg sm:text-3xl">
            Good {getGreeting()},{" "}
            <span className="bg-gradient-to-r from-theme-gradient-start to-theme-gradient-end bg-clip-text text-transparent">
              {user?.name?.split(" ")[0]}
            </span>
          </h1>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickStatCard
            icon={<Calendar className="h-5 w-5" />}
            label="Today"
            value={new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
            colorClass="bg-theme-primary-bg text-theme-primary-fg"
          />
          <QuickStatCard
            icon={<Shield className="h-5 w-5" />}
            label="Your Role"
            value={user?.role === "admin" ? "Administrator" : "Staff Member"}
            colorClass="bg-theme-warning-bg text-theme-warning-fg"
          />
          <QuickStatCard
            icon={<Users className="h-5 w-5" />}
            label="Team Size"
            value="4 Members"
            colorClass="bg-theme-info-bg text-theme-info-fg"
          />
        </div>

        {/* Action Cards */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-theme-fg-muted">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Staff Portal */}
            {user?.role !== "admin" && (
              <ActionCard
                href="/log-task"
                icon={<ClipboardList className="h-6 w-6" />}
                title="Staff Task Logger"
                description="Submit daily reporting tasks, log multiple activities with different statuses and time tracking."
                accentClass="bg-theme-primary-bg text-theme-primary-fg"
                arrowColorClass="text-theme-primary hover:text-theme-primary-hover"
              />
            )}

            {/* Admin Dashboard – only visible to admin */}
            {user?.role === "admin" && (
              <ActionCard
                href="/task-report"
                icon={<BarChart3 className="h-6 w-6" />}
                title="Task Reports Dashboard"
                description="Review team metrics, completion rates, visual analytics, and search across all logged reports."
                accentClass="bg-theme-primary-bg text-theme-primary-fg"
                arrowColorClass="text-theme-primary hover:text-theme-primary-hover"
              />
            )}

            {user?.role === "staff" && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-theme-border p-8 text-center">
                <TrendingUp className="h-8 w-8 text-theme-fg-muted mb-3" />
                <p className="text-sm font-semibold text-theme-fg-secondary">
                  Performance Insights
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-theme-border pt-6">
          <p className="text-xs text-theme-fg-muted text-center">
            &copy; {new Date().getFullYear()} DailySync. All rights reserved.
          </p>
        </div>
      </div>
    </Sidebar>
  );
}

/* ─── Helper Components ─── */

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}

function QuickStatCard({
  icon,
  label,
  value,
  colorClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  colorClass: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-theme-border bg-theme-bg-surface p-5 shadow-sm">
      <div className={`rounded-xl p-2.5 ${colorClass}`}>{icon}</div>
      <div>
        <p className="text-xs font-medium text-theme-fg-muted">{label}</p>
        <p className="text-sm font-bold text-theme-fg">{value}</p>
      </div>
    </div>
  );
}

function ActionCard({
  href,
  icon,
  title,
  description,
  accentClass,
  arrowColorClass,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  accentClass: string;
  arrowColorClass: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col rounded-2xl border border-theme-border bg-theme-bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accentClass}`}>
        {icon}
      </div>
      <h3 className="mt-4 text-base font-bold text-theme-fg flex-1">{title}</h3>
      <div className={`mt-4 inline-flex items-center text-sm font-semibold ${arrowColorClass} transition-colors`}>
        <span>Open</span>
        <ArrowRight className="ml-1.5 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

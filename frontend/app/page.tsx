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
import TaskStats from "../components/TaskStats";
import TaskChart from "../components/TaskChart";

interface Task {
  id: string;
  taskName: string;
  userName: string;
  userEmail: string;
  startDate: string;
  endDate: string;
  totalMinutes: number;
  status: "Completed" | "In Progress" | "Pending" | "Blocked";
  priority: "Low" | "Medium" | "High";
  projectName?: string;
}

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (user?.role === "admin") {
      try {
        const stored = localStorage.getItem("dailysync-tasks");
        if (stored) {
          setTasks(JSON.parse(stored));
        }
      } catch (error) {
        console.warn("Could not access localStorage:", error);
      } finally {
        setIsLoaded(true);
      }
    }
  }, [user]);

  if (!isAuthenticated) {
    return <LoginPanel />;
  }

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
        {/* Welcome header */}
        <div className="space-y-1">
        
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

        {/* Admin Dashboard View */}
        {user?.role === "admin" ? (
          <div className="space-y-8">
            <section aria-label="Task Statistics">
              <TaskStats tasks={tasks} />
            </section>
            
            <section aria-label="Task Visualizations">
              <TaskChart tasks={tasks} />
            </section>

           
          </div>
        ) : (
         <></>
        )}

       
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

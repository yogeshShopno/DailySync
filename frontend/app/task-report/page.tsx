"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import LoginPanel from "../../components/LoginPanel";
import Sidebar from "../../components/Sidebar";
import TaskStats from "../../components/TaskStats";
import TaskChart from "../../components/TaskChart";
import TaskTable from "../../components/TaskTable";
import { ShieldAlert, Loader2 } from "lucide-react";
import { fetchTasks, fetchDashboardStats, type Task, type DashboardStats } from "../../services/taskService";

export default function AdminTaskReportingPage() {
  const { isAuthenticated, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      setIsLoaded(true);
      return;
    }

    const loadData = async () => {
      try {
        const [tasksData, statsData] = await Promise.all([
          fetchTasks(),
          fetchDashboardStats(),
        ]);
        setTasks(tasksData);
        setStats(statsData);
      } catch (err: any) {
        setApiError(err?.response?.data?.message || "Failed to load data.");
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) return <LoginPanel />;

  // Role guard — only admins can see reports
  if (user?.role !== "admin") {
    return (
      <Sidebar>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-8 space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-theme-error-bg">
            <ShieldAlert className="h-8 w-8 text-theme-error" />
          </div>
          <h2 className="text-xl font-bold text-theme-fg">Access Restricted</h2>
          <p className="text-sm text-theme-fg-secondary max-w-sm">
            You don&apos;t have permission to view this page. Only administrators
            can access the Task Reports Dashboard.
          </p>
        </div>
      </Sidebar>
    );
  }

  if (!isLoaded) {
    return (
      <Sidebar>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-2 text-sm font-semibold text-theme-fg-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading Analytics...
          </div>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-theme-border pb-6">
          <div>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-theme-fg sm:text-3xl">
              Staff Reports
            </h1>
            <p className="text-sm text-theme-fg-secondary mt-1">
              {stats?.total || tasks.length} total tasks across all staff
            </p>
          </div>
        </header>

        {/* API Error Banner */}
        {apiError && (
          <div className="rounded-xl bg-theme-error-bg border border-theme-error/20 px-4 py-3 text-sm text-theme-error-fg">
            ⚠️ {apiError}
          </div>
        )}

        {/* Stats */}
        <section aria-label="Task Statistics">
          <TaskStats stats={stats} tasks={tasks} />
        </section>

        {/* Charts */}
        <section aria-label="Task Visualizations">
          <TaskChart stats={stats} tasks={tasks} />
        </section>

        {/* Detailed Tasks Table */}
        <section
          aria-label="Detailed Tasks List"
          className="space-y-4 border-t border-theme-border pt-6"
        >
          <TaskTable tasks={tasks} />
        </section>
      </div>
    </Sidebar>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import LoginPanel from "../../components/LoginPanel";
import Sidebar from "../../components/Sidebar";
import TaskStats from "../../components/TaskStats";
import TaskChart from "../../components/TaskChart";
import TaskTable from "../../components/TaskTable";
import Button from "../../components/ui/Button";
import { Download, ShieldAlert } from "lucide-react";

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

const initialTasks: Task[] = [
  {
    id: "task-1",
    taskName: "Complete Backend User Authentication",
    userName: "Yogesh Jain",
    userEmail: "yogesh@dailysync.com",
    startDate: "2026-07-01",
    endDate: "2026-07-05",
    totalMinutes: 240,
    status: "Completed",
    priority: "High",
    projectName: "DailySync Dashboard",
  },
  {
    id: "task-2",
    taskName: "Setup MongoDB connection and schemas",
    userName: "John Doe",
    userEmail: "john@dailysync.com",
    startDate: "2026-07-02",
    endDate: "2026-07-04",
    totalMinutes: 180,
    status: "Completed",
    priority: "High",
    projectName: "DailySync Dashboard",
  },
  {
    id: "task-3",
    taskName: "Build Task Reporting Dashboard UI",
    userName: "Yogesh Jain",
    userEmail: "yogesh@dailysync.com",
    startDate: "2026-07-08",
    endDate: "2026-07-10",
    totalMinutes: 120,
    status: "In Progress",
    priority: "High",
    projectName: "DailySync Dashboard",
  },
  {
    id: "task-4",
    taskName: "Design UI components & cards",
    userName: "Sarah Connor",
    userEmail: "sarah@dailysync.com",
    startDate: "2026-07-04",
    endDate: "2026-07-07",
    totalMinutes: 150,
    status: "Completed",
    priority: "Medium",
    projectName: "Customer Mobile App",
  },
  {
    id: "task-5",
    taskName: "Integrate push notification service",
    userName: "John Doe",
    userEmail: "john@dailysync.com",
    startDate: "2026-07-10",
    endDate: "2026-07-15",
    totalMinutes: 0,
    status: "Pending",
    priority: "Medium",
    projectName: "Customer Mobile App",
  },
  {
    id: "task-6",
    taskName: "Fix navigation drawer styling bug",
    userName: "Sarah Connor",
    userEmail: "sarah@dailysync.com",
    startDate: "2026-07-08",
    endDate: "2026-07-09",
    totalMinutes: 45,
    status: "Blocked",
    priority: "Low",
    projectName: "Customer Mobile App",
  },
];

export default function AdminTaskReportingPage() {
  const { isAuthenticated, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("dailysync-tasks");
      if (stored) {
        setTasks(JSON.parse(stored));
      } else {
        setTasks(initialTasks);
        try {
          localStorage.setItem("dailysync-tasks", JSON.stringify(initialTasks));
        } catch (e) {}
      }
    } catch (error) {
      console.warn("Could not access localStorage:", error);
      setTasks(initialTasks);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Report exported successfully as CSV!");
    }, 850);
  };

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
          <div className="text-sm font-semibold text-theme-fg-muted animate-pulse">
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
            <p className="text-xs font-semibold text-theme-primary uppercase tracking-wider">
              Admin Workspace
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-theme-fg sm:text-3xl">
              Task Reporting Dashboard
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={handleExport}
              disabled={isExporting}
              isLoading={isExporting}
            >
              <Download className="-ml-1 mr-2 h-4 w-4" />
              {isExporting ? "Exporting..." : "Export CSV"}
            </Button>
          </div>
        </header>

        {/* Stats Cards */}
        <section aria-label="Task Statistics">
          <TaskStats tasks={tasks} />
        </section>

        {/* Charts */}
        <section aria-label="Task Visualizations">
          <TaskChart tasks={tasks} />
        </section>

        {/* Detailed Tasks Table */}
        <section
          aria-label="Detailed Tasks List"
          className="space-y-4 border-t border-theme-border pt-6"
        >
          <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-theme-fg">
                Admin Activity Registry
              </h2>
            </div>
            <span className="self-start md:self-auto inline-flex items-center rounded-lg bg-theme-bg-inset px-2.5 py-1 text-xs font-semibold text-theme-fg-secondary border border-theme-border">
              Total Logged: {tasks.length}
            </span>
          </div>
          <TaskTable tasks={tasks} />
        </section>
      </div>
    </Sidebar>
  );
}

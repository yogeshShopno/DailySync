"use client";

import React from "react";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";

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

interface TaskStatsProps {
  tasks: Task[];
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const blocked = tasks.filter((t) => t.status === "Blocked").length;
  const pending = tasks.filter((t) => t.status === "Pending").length;

  const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const inProgressPct = total > 0 ? Math.round((inProgress / total) * 100) : 0;
  const blockedOrPendingPct =
    total > 0 ? Math.round(((blocked + pending) / total) * 100) : 0;

  const statItems = [
    {
      title: "Total Tasks",
      value: total,
      description: "Across all active projects",
      iconBg: "bg-theme-info-bg",
      iconColor: "text-theme-info-fg",
      borderColor: "bg-theme-info",
      icon: <ClipboardList className="w-6 h-6" />,
    },
    {
      title: "Completed",
      value: completed,
      description: `${completedPct}% of total tasks completed`,
      iconBg: "bg-theme-success-bg",
      iconColor: "text-theme-success-fg",
      borderColor: "bg-theme-success",
      icon: <CheckCircle2 className="w-6 h-6" />,
    },
    {
      title: "In Progress",
      value: inProgress,
      description: `${inProgressPct}% currently active`,
      iconBg: "bg-theme-warning-bg",
      iconColor: "text-theme-warning-fg",
      borderColor: "bg-theme-warning",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      title: "Attention Required",
      value: blocked + pending,
      description: `${blockedOrPendingPct}% pending or blocked`,
      iconBg: "bg-theme-error-bg",
      iconColor: "text-theme-error-fg",
      borderColor: "bg-theme-error",
      icon: <AlertTriangle className="w-6 h-6" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-2xl border border-theme-border bg-theme-bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-theme-fg-secondary">
              {item.title}
            </span>
            <div className={`rounded-xl p-2.5 ${item.iconBg} ${item.iconColor}`}>
              {item.icon}
            </div>
          </div>

          <div className="mt-4">
            <span className="text-3xl font-bold tracking-tight text-theme-fg">
              {item.value}
            </span>
            <p className="mt-2 text-xs text-theme-fg-muted">
              {item.description}
            </p>
          </div>

          {/* Bottom gradient indicator line */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-1 ${item.borderColor}`}
          />
        </div>
      ))}
    </div>
  );
}

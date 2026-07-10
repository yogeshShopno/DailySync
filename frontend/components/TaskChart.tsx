"use client";

import React from "react";

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

interface TaskChartProps {
  tasks: Task[];
}

export default function TaskChart({ tasks }: TaskChartProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const pending = tasks.filter((t) => t.status === "Pending").length;
  const blocked = tasks.filter((t) => t.status === "Blocked").length;

  const completedPct = total > 0 ? (completed / total) * 100 : 0;
  const inProgressPct = total > 0 ? (inProgress / total) * 100 : 0;
  const pendingPct = total > 0 ? (pending / total) * 100 : 0;
  const blockedPct = total > 0 ? (blocked / total) * 100 : 0;

  // Donut chart calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completedPct / 100) * circumference;

  // Bar chart data using CSS variables for colors
  const barData = [
    {
      label: "Completed",
      count: completed,
      pct: completedPct,
      bgClass: "bg-theme-success",
      dotClass: "bg-theme-success",
    },
    {
      label: "In Progress",
      count: inProgress,
      pct: inProgressPct,
      bgClass: "bg-theme-warning",
      dotClass: "bg-theme-warning",
    },
    {
      label: "Pending",
      count: pending,
      pct: pendingPct,
      bgClass: "bg-theme-info",
      dotClass: "bg-theme-info",
    },
    {
      label: "Blocked",
      count: blocked,
      pct: blockedPct,
      bgClass: "bg-theme-error",
      dotClass: "bg-theme-error",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Overall Progress Circle */}
      <div className="rounded-2xl border border-theme-border bg-theme-bg-surface p-6 shadow-sm lg:col-span-1">
        <h3 className="text-base font-semibold text-theme-fg">
          Overall Progress
        </h3>
        <p className="mt-1 text-xs text-theme-fg-muted">
          Percentage of tasks fully completed
        </p>

        <div className="relative mt-8 flex flex-col items-center justify-center">
          <svg className="w-40 h-40 transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-theme-border"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Foreground Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-theme-success transition-all duration-1000 ease-out"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold tracking-tight text-theme-fg">
              {Math.round(completedPct)}%
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-theme-fg-muted">
              Completed
            </span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 text-center border-t border-theme-border pt-4">
          <div>
            <span className="text-xs text-theme-fg-muted">Completed</span>
            <p className="text-lg font-bold text-theme-success">{completed}</p>
          </div>
          <div>
            <span className="text-xs text-theme-fg-muted">Remaining</span>
            <p className="text-lg font-bold text-theme-fg-secondary">
              {total - completed}
            </p>
          </div>
        </div>
      </div>

      {/* Task Distribution Bar Chart */}
      <div className="rounded-2xl border border-theme-border bg-theme-bg-surface p-6 shadow-sm lg:col-span-2">
        <h3 className="text-base font-semibold text-theme-fg">
          Task Distribution
        </h3>
        <p className="mt-1 text-xs text-theme-fg-muted">
          Breakdown of tasks by current status
        </p>

        <div className="mt-6 space-y-5">
          {barData.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${item.dotClass}`}
                  />
                  <span className="text-sm font-medium text-theme-fg-secondary">
                    {item.label}
                  </span>
                </div>
                <span className="text-sm font-bold text-theme-fg">
                  {item.count}{" "}
                  <span className="font-normal text-theme-fg-muted">
                    ({Math.round(item.pct)}%)
                  </span>
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-theme-bg-inset overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.bgClass} transition-all duration-700 ease-out`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Stacked bar */}
        <div className="mt-8 border-t border-theme-border pt-5">
          <p className="text-xs font-semibold text-theme-fg-muted uppercase tracking-wider mb-3">
            Combined Overview
          </p>
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-theme-bg-inset">
            {barData.map(
              (item) =>
                item.pct > 0 && (
                  <div
                    key={item.label}
                    className={`${item.bgClass} transition-all duration-700`}
                    style={{ width: `${item.pct}%` }}
                    title={`${item.label}: ${Math.round(item.pct)}%`}
                  />
                )
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-4">
            {barData.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${item.dotClass}`}
                />
                <span className="text-[11px] text-theme-fg-muted">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/Table";
import { Search, Calendar, ArrowUpDown, Frown, User, ChevronDown, ChevronRight } from "lucide-react";
import CalendarPicker from "./ui/CalendarPicker";

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

interface TaskTableProps {
  tasks: Task[];
}

type SortKey = "taskName" | "endDate" | "totalMinutes" | "status" | "priority";
type SortOrder = "asc" | "desc";

export default function TaskTable({ tasks }: TaskTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [employeeFilter, setEmployeeFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  
  const [sortKey, setSortKey] = useState<SortKey>("endDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  const [expandedEmployees, setExpandedEmployees] = useState<Set<string>>(new Set());

  const toggleEmployeeGroup = (empName: string) => {
    setExpandedEmployees((prev) => {
      const next = new Set(prev);
      if (next.has(empName)) next.delete(empName);
      else next.add(empName);
      return next;
    });
  };

  const uniqueEmployees = useMemo(() => {
    const names = tasks.map((t) => t.userName);
    return Array.from(new Set(names)).sort();
  }, [tasks]);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-theme-success-bg text-theme-success-fg";
      case "In Progress":
        return "bg-theme-warning-bg text-theme-warning-fg";
      case "Pending":
        return "bg-theme-info-bg text-theme-info-fg";
      case "Blocked":
        return "bg-theme-error-bg text-theme-error-fg";
    }
  };

  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "High":
        return "bg-theme-error-bg text-theme-error-fg";
      case "Medium":
        return "bg-theme-warning-bg text-theme-warning-fg";
      case "Low":
        return "bg-theme-bg-inset text-theme-fg-muted";
    }
  };

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const filteredSortedTasks = useMemo(() => {
    let result = [...tasks];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.taskName.toLowerCase().includes(q) ||
          task.userName.toLowerCase().includes(q) ||
          task.userEmail.toLowerCase().includes(q) ||
          (task.projectName && task.projectName.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((task) => task.status === statusFilter);
    }

    if (priorityFilter !== "All") {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    if (employeeFilter !== "All") {
      result = result.filter((task) => task.userName === employeeFilter);
    }

    if (dateFilter !== "All") {
      const filterParts = dateFilter.split("-");
      if (filterParts.length === 3) {
        const [y, m, d] = filterParts.map(Number);
        result = result.filter((task) => {
          const taskDate = new Date(task.endDate);
          return (
            taskDate.getFullYear() === y &&
            taskDate.getMonth() === m - 1 &&
            taskDate.getDate() === d
          );
        });
      }
    }

    result.sort((a, b) => {
      let aVal: any = a[sortKey];
      let bVal: any = b[sortKey];

      if (sortKey === "endDate") {
        aVal = new Date(a.endDate).getTime();
        bVal = new Date(b.endDate).getTime();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [tasks, searchQuery, statusFilter, priorityFilter, employeeFilter, dateFilter, sortKey, sortOrder]);

  const totalItems = filteredSortedTasks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const verifiedPage = currentPage > totalPages ? totalPages : currentPage;

  const paginatedTasks = useMemo(() => {
    const startIndex = (verifiedPage - 1) * itemsPerPage;
    return filteredSortedTasks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSortedTasks, verifiedPage, itemsPerPage]);

  const groupedTasks = useMemo(() => {
    const groupsByEmployee: { [emp: string]: Task[] } = {};

    paginatedTasks.forEach((task) => {
      const emp = task.userName;
      if (!groupsByEmployee[emp]) groupsByEmployee[emp] = [];
      groupsByEmployee[emp].push(task);
    });

    const orderedEmployees = Object.keys(groupsByEmployee).sort();

    return orderedEmployees.map((empName) => {
      const tasksForEmp = groupsByEmployee[empName];
      const totalEmpMinutes = tasksForEmp.reduce((sum, t) => sum + t.totalMinutes, 0);

      return {
        employeeName: empName,
        userEmail: tasksForEmp[0].userEmail,
        tasks: tasksForEmp,
        totalTasks: tasksForEmp.length,
        totalEmpMinutes
      };
    });
  }, [paginatedTasks, sortKey, sortOrder]);

  const SortIndicator = ({ column }: { column: SortKey }) =>
    sortKey === column ? (
      <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
    ) : null;

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-theme-fg-muted" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-theme-border bg-theme-bg-surface py-2.5 pl-10 pr-4 text-sm text-theme-fg outline-none placeholder:text-theme-fg-muted focus:border-theme-border-focus focus:ring-2 focus:ring-theme-ring"
            placeholder="Search tasks, assignees, projects..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Date Filter Above Other Filters */}
        <div className="flex items-center gap-3 bg-theme-bg-surface p-3 rounded-xl border border-theme-border w-fit shadow-sm">
          <span className="text-xs font-bold text-theme-fg-muted uppercase tracking-wider">
            Filter by Date:
          </span>
          <CalendarPicker
            value={dateFilter === "All" ? null : dateFilter}
            onChange={(date) => {
              setDateFilter(date || "All");
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 bg-theme-bg-surface p-3 rounded-xl border border-theme-border">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-theme-fg-muted">
              Employee:
            </span>
            <select
              className="rounded-lg border border-theme-border bg-theme-bg-surface py-1.5 px-3 text-xs font-medium text-theme-fg outline-none focus:border-theme-border-focus focus:ring-2 focus:ring-theme-ring cursor-pointer"
              value={employeeFilter}
              onChange={(e) => {
                setEmployeeFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Staff</option>
              {uniqueEmployees.map(emp => (
                <option key={emp} value={emp}>{emp}</option>
              ))}
            </select>
          </div>

          <div className="hidden sm:block w-px h-6 bg-theme-border mx-1"></div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-theme-fg-muted">
              Status:
            </span>
            <select
              className="rounded-lg border border-theme-border bg-theme-bg-surface py-1.5 px-3 text-xs font-medium text-theme-fg outline-none focus:border-theme-border-focus focus:ring-2 focus:ring-theme-ring cursor-pointer"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-theme-fg-muted">
              Priority:
            </span>
            <select
              className="rounded-lg border border-theme-border bg-theme-bg-surface py-1.5 px-3 text-xs font-medium text-theme-fg outline-none focus:border-theme-border-focus focus:ring-2 focus:ring-theme-ring cursor-pointer"
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="!hover:bg-transparent">
            <TableHead onClick={() => handleSort("taskName")}>
              <div className="flex items-center">
                Task Name
                <SortIndicator column="taskName" />
              </div>
            </TableHead>
            <TableHead onClick={() => handleSort("status")}>
              <div className="flex items-center">
                Status
                <SortIndicator column="status" />
              </div>
            </TableHead>
            <TableHead onClick={() => handleSort("priority")}>
              <div className="flex items-center">
                Priority
                <SortIndicator column="priority" />
              </div>
            </TableHead>
            <TableHead onClick={() => handleSort("endDate")}>
              <div className="flex items-center">
                Due Date
                <SortIndicator column="endDate" />
              </div>
            </TableHead>
            <TableHead onClick={() => handleSort("totalMinutes")}>
              <div className="flex items-center">
                Time Spent
                <SortIndicator column="totalMinutes" />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedTasks.length > 0 ? (
            groupedTasks.map((group) => (
              <React.Fragment key={group.employeeName}>
                {/* Level 1: Employee Separator */}
                <tr 
                  className="bg-theme-bg-inset select-none border-y border-theme-border cursor-pointer hover:bg-theme-bg-inset/80 transition-colors"
                  onClick={() => toggleEmployeeGroup(group.employeeName)}
                >
                  <td
                    colSpan={5}
                    className="py-3 px-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {expandedEmployees.has(group.employeeName) ? (
                          <ChevronDown className="h-4 w-4 text-theme-fg-muted" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-theme-fg-muted" />
                        )}
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-theme-gradient-start to-theme-gradient-end text-[10px] font-bold text-white shadow-sm">
                          {getInitials(group.employeeName)}
                        </div>
                        <span className="font-bold text-sm text-theme-fg">
                          {group.employeeName}
                        </span>
                        <span className="text-theme-border">|</span>
                        <span className="text-theme-fg-muted font-semibold uppercase tracking-wider text-xs">
                          {group.totalTasks} {group.totalTasks === 1 ? "task" : "tasks"} logged
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-theme-primary">
                        Total Hours: {formatTime(group.totalEmpMinutes)}
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Level 2: Tasks for Employee */}
                {expandedEmployees.has(group.employeeName) && group.tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium text-theme-fg pl-12">
                      <div>
                        <span>{task.taskName}</span>
                        {task.projectName && (
                          <span className="block text-[10px] text-theme-primary-fg font-bold mt-0.5 uppercase tracking-wider">
                            {task.projectName}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-lg px-2 py-1 text-xs font-semibold ${getStatusBadge(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityBadge(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </TableCell>
                    <TableCell className="text-theme-fg-secondary">
                      {new Date(task.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="font-semibold text-theme-fg">
                      {formatTime(task.totalMinutes)}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="py-12 text-center text-theme-fg-muted"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Frown className="h-8 w-8 opacity-40" />
                  <span className="text-sm font-medium">
                    No tasks found matching your criteria.
                  </span>
                </div>
              </td>
            </tr>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-theme-border pt-4">
          <div className="text-xs text-theme-fg-muted">
            Showing{" "}
            <span className="font-semibold text-theme-fg">
              {(verifiedPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-theme-fg">
              {Math.min(verifiedPage * itemsPerPage, totalItems)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-theme-fg">{totalItems}</span>{" "}
            tasks
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={verifiedPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={verifiedPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

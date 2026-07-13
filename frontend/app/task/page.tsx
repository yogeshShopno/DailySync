"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import LoginPanel from "../../components/LoginPanel";
import Sidebar from "../../components/Sidebar";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import FormError from "../../components/ui/FormError";
import {
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Loader2,
} from "lucide-react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  type Task,
  type CreateTaskPayload,
} from "../../services/taskService";
import { projectService, type Project } from "../../services/projectService";

interface TaskFormItem {
  id: string;
  projectId: string;
  taskName: string;
  status: "Completed" | "In Progress" | "Pending" | "Blocked";
  priority: "Low" | "Medium" | "High";
  hours: number;
  minutes: number;
}

// Removed static projects

const statusOptions = [
  { value: "Completed", label: "Completed" },
  { value: "In Progress", label: "In Progress" },
  { value: "Pending", label: "Pending" },
  { value: "Blocked", label: "Blocked" },
];

const priorityOptions = [
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];

export default function StaffTaskLoggingPage() {
  const { isAuthenticated, user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Modal control & date states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");

  // Initial form items are set after projects load
  const [taskItems, setTaskItems] = useState<TaskFormItem[]>([]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // ── Load tasks from API ─────────────────────────────────────────────────────
  useEffect(() => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
    if (!isAuthenticated) return;

    const loadData = async () => {
      try {
        const [taskData, projectData] = await Promise.all([
          fetchTasks(),
          projectService.fetchProjects()
        ]);
        setTasks(taskData);
        setProjects(projectData);
        if (projectData.length > 0) {
          setTaskItems([
            {
              id: "item-init",
              projectId: projectData[0]._id,
              taskName: "",
              status: "In Progress",
              priority: "Medium",
              hours: 1,
              minutes: 0,
            }
          ]);
        }
      } catch (err: any) {
        setApiError(err?.response?.data?.message || "Failed to load tasks.");
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // ── Form Handlers ───────────────────────────────────────────────────────────
  const handleAddTaskRow = () => {
    setTaskItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        projectId: projects[0]?._id || "",
        taskName: "",
        status: "In Progress",
        priority: "Medium",
        hours: 1,
        minutes: 0,
      },
    ]);
  };

  const handleRemoveTaskRow = (itemId: string) => {
    if (taskItems.length === 1) return;
    setTaskItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleUpdateTaskItem = (
    itemId: string,
    field: keyof TaskFormItem,
    value: any
  ) => {
    setTaskItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const emptyTask = taskItems.find((t) => !t.taskName.trim());
    if (emptyTask) {
      setFormError("Please enter descriptions for all work activities.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingTaskId) {
        // Update existing task (only first item in edit mode)
        const item = taskItems[0];
        const totalMinutes = Number(item.hours) * 60 + Number(item.minutes);

        const payload: Partial<CreateTaskPayload> = {
          taskName: item.taskName.trim(),
          startDate: selectedDate,
          endDate: selectedDate,
          totalMinutes,
          status: item.status,
          priority: item.priority,
          projectId: item.projectId || undefined,
        };

        const updated = await updateTask(editingTaskId, payload);
        setTasks((prev) =>
          prev.map((t) => (t.id === editingTaskId ? updated : t))
        );
        showToast("Task updated successfully!");
      } else {
        // Create multiple tasks
        const created: Task[] = [];
        for (const item of taskItems) {
          const totalMinutes = Number(item.hours) * 60 + Number(item.minutes);

          const payload: CreateTaskPayload = {
            taskName: item.taskName.trim(),
            startDate: selectedDate,
            endDate: selectedDate,
            totalMinutes,
            status: item.status,
            priority: item.priority,
            projectId: item.projectId || undefined,
          };

          const task = await createTask(payload);
          created.push(task);
        }
        setTasks((prev) => [...created, ...prev]);
        showToast(`Logged ${created.length} task entries successfully!`);
      }

      setEditingTaskId(null);
      setTaskItems([
        {
          id: `item-${Date.now()}`,
          projectId: projects[0]?._id || "",
          taskName: "",
          status: "Completed",
          priority: "Medium",
          hours: 1,
          minutes: 0,
        },
      ]);
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Failed to save task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTask = (task: Task) => {
    // Find matching project by name (since task.projectName is populated)
    const project = projects.find((p) => p.name === task.projectName) || projects[0];

    setTaskItems([
      {
        id: `item-edit-${task.id}`,
        projectId: project?._id || "",
        taskName: task.taskName,
        status: task.status,
        priority: task.priority,
        hours: Math.floor(task.totalMinutes / 60),
        minutes: task.totalMinutes % 60,
      },
    ]);
    setSelectedDate(task.endDate);
    setEditingTaskId(task.id);
    setIsModalOpen(true);
  };

  const handleRemoveTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast("Task deleted.");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete task.");
    }
  };

  // ── Filter tasks for current logged-in user ─────────────────────────────────
  const myTasks = tasks.filter(
    (t) => t.userEmail?.toLowerCase() === user?.email?.toLowerCase()
  );

  const groupedTasks = useMemo(() => {
    const groups: { [date: string]: Task[] } = {};
    myTasks.forEach((task) => {
      const dateStr = task.endDate;
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(task);
    });

    return Object.keys(groups)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((date) => {
        const list = groups[date];
        const totalMin = list.reduce((sum, t) => sum + t.totalMinutes, 0);
        return { date, tasks: list, totalMinutes: totalMin };
      });
  }, [myTasks]);

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

  const formatMinutes = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
  };

  if (!isAuthenticated) return <LoginPanel />;

  if (!isLoaded) {
    return (
      <Sidebar>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-2 text-sm font-semibold text-theme-fg-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading Workspace...
          </div>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-theme-primary-bg border border-theme-primary/20 px-4 py-3 text-sm font-medium text-theme-primary-fg shadow-lg">
            <CheckCircle2 className="h-4 w-4 text-theme-primary flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* API Error Banner */}
        {apiError && (
          <div className="rounded-xl bg-theme-error-bg border border-theme-error/20 px-4 py-3 text-sm text-theme-error-fg">
            ⚠️ {apiError}
          </div>
        )}

        {/* Header section */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-theme-border pb-6">
          <div>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-theme-fg">
              Task Reporting
            </h1>
            <p className="text-sm text-theme-fg-secondary mt-1">
              Logged in as{" "}
              <span className="font-semibold text-theme-fg">{user?.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setEditingTaskId(null);
                setTaskItems([
                  {
                    id: `item-init-${Date.now()}`,
                    projectId: projects[0]?._id || "",
                    taskName: "",
                    status: "In Progress",
                    priority: "Medium",
                    hours: 1,
                    minutes: 0,
                  },
                ]);
                setSelectedDate(new Date().toISOString().split("T")[0]);
                setIsModalOpen(true);
              }}
            >
              <Plus className="-ml-1 mr-1.5 h-4 w-4" />
              Report Tasks
            </Button>
          </div>
        </header>

        {/* Grouped Task Submissions */}
        <div className="rounded-2xl border border-theme-border bg-theme-bg-surface p-6 shadow-sm min-h-[400px] flex flex-col">
          <div className="border-b border-theme-border pb-4 mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-theme-fg">
                Your Logged Submissions
              </h2>
            </div>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto max-h-[600px] pr-1">
            {groupedTasks.length > 0 ? (
              groupedTasks.map((group) => (
                <div key={group.date} className="space-y-3">
                  {/* Date Separator */}
                  <div className="flex items-center justify-between bg-theme-bg-inset px-4 py-2.5 rounded-xl border border-theme-border">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-theme-primary" />
                      <span className="text-xs font-bold text-theme-fg">
                        {new Date(group.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-theme-fg-muted">
                      {formatMinutes(group.totalMinutes)} total
                    </span>
                  </div>

                  {/* Day Tasks */}
                  <div className="space-y-3 pl-2 border-l-2 border-theme-border">
                    {group.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="group flex flex-col justify-between rounded-xl border border-theme-border p-4 transition-all hover:bg-theme-bg-surface-hover md:flex-row md:items-center"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-primary-fg">
                              {task.projectName || "Default Project"}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-theme-fg">
                            {task.taskName}
                          </h4>
                          <p className="text-xs text-theme-fg-muted">
                            {formatMinutes(task.totalMinutes)}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between md:mt-0 md:gap-4">
                          <span
                            className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${getStatusBadge(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleEditTask(task)}
                              className="rounded-lg p-1.5 text-theme-fg-muted hover:bg-theme-info-bg hover:text-theme-info transition-colors cursor-pointer"
                              title="Edit submission entry"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveTask(task.id)}
                              className="rounded-lg p-1.5 text-theme-fg-muted hover:bg-theme-error-bg hover:text-theme-error transition-colors cursor-pointer"
                              title="Delete submission entry"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-20 text-center text-theme-fg-muted">
                <AlertTriangle className="h-10 w-10 mb-2 opacity-40" />
                <span className="text-xs font-medium">
                  No tasks logged yet. Click &quot;Report Tasks&quot; to submit
                  timesheets.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Log Task Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setFormError(null);
          }}
          title={editingTaskId ? "Edit Task" : "Daily Reporting"}
          size="xl"
        >
          <form onSubmit={handleFormSubmit} className="space-y-5">
            <FormError message={formError} />
            
            {/* Profile and Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-theme-bg-inset p-4 rounded-xl border border-theme-border">
              <div>
                <span className="block text-[10px] font-bold text-theme-fg-muted uppercase tracking-wider mb-1">
                  Staff
                </span>
                <div className="font-bold flex-col text-sm text-theme-fg">
                  {user?.name}{" "}
                  <span className="font-normal text-xs text-theme-fg-secondary">
                    ({user?.email})
                  </span>
                </div>
              </div>
              <Input
                label="Date"
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {/* Tasks Row Builder */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-theme-border pb-2">
                <span className="text-xs font-bold text-theme-fg-secondary uppercase tracking-wider">
                  Task Entries
                </span>
              </div>

              {taskItems.map((item) => (
                <div
                  key={item.id}
                  className="relative p-4 rounded-xl border border-theme-border bg-theme-bg-surface space-y-3"
                >
                  {/* Project & Task Name */}
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                    {/* Project */}
                    <Select
                      label="Project"
                      options={projects.map((p) => ({
                        value: p._id,
                        label: p.name,
                      }))}
                      value={item.projectId}
                      onChange={(e) =>
                        handleUpdateTaskItem(item.id, "projectId", e.target.value)
                      }
                    />

                    {/* Task */}
                    <Input
                      label="Task"
                      type="text"
                      required
                      placeholder="e.g. Implement user dashboard widgets"
                      value={item.taskName}
                      onChange={(e) =>
                        handleUpdateTaskItem(item.id, "taskName", e.target.value)
                      }
                    />

                    {/* Delete row */}
                    <div className="flex items-end h-full pb-1">
                      {taskItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTaskRow(item.id)}
                          className="h-10 w-10 flex items-center justify-center text-red-500 transition cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Status, Priority, Time */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
                    <Select
                      label="Status"
                      options={statusOptions}
                      value={item.status}
                      onChange={(e) =>
                        handleUpdateTaskItem(item.id, "status", e.target.value)
                      }
                    />
                    <Select
                      label="Priority"
                      options={priorityOptions}
                      value={item.priority}
                      onChange={(e) =>
                        handleUpdateTaskItem(item.id, "priority", e.target.value)
                      }
                    />
                    <Input
                      label="Hours"
                      type="number"
                      min={0}
                      max={24}
                      value={item.hours}
                      onChange={(e) =>
                        handleUpdateTaskItem(
                          item.id,
                          "hours",
                          Number(e.target.value)
                        )
                      }
                    />
                    <Input
                      label="Minutes"
                      type="number"
                      min={0}
                      max={59}
                      value={item.minutes}
                      onChange={(e) =>
                        handleUpdateTaskItem(
                          item.id,
                          "minutes",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              ))}

              {/* Add Row Button */}
              {!editingTaskId && (
                <button
                  type="button"
                  onClick={handleAddTaskRow}
                  className="w-full flex items-center justify-center py-2.5 border-2 border-dashed border-theme-border rounded-xl text-xs font-semibold text-theme-fg-muted hover:border-theme-primary hover:text-theme-primary transition-colors cursor-pointer"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  <span>Add task</span>
                </button>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-theme-border">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                {editingTaskId ? "Update Task" : "Submit Report"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Sidebar>
  );
}

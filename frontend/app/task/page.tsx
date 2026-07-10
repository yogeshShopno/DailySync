"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import LoginPanel from "../../components/LoginPanel";
import Sidebar from "../../components/Sidebar";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import {
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Edit2,
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

interface TaskFormItem {
  id: string;
  projectId: string;
  taskName: string;
  status: "Completed" | "In Progress" | "Pending" | "Blocked";
  priority: "Low" | "Medium" | "High";
  hours: number;
  minutes: number;
}

// Static project list
const staticProjects = [
  { id: "proj-1", name: "DailySync Dashboard" },
  { id: "proj-2", name: "Enterprise CRM Integration" },
  { id: "proj-3", name: "Automated Test Pipeline" },
  { id: "proj-4", name: "API Gateway Security" },
  { id: "proj-5", name: "Customer Mobile App" },
];

// Static staff list
const staticStaff = [
  { name: "Yogesh Jain", email: "yogesh@dailysync.com" },
  { name: "John Doe", email: "john@dailysync.com" },
  { name: "Sarah Connor", email: "sarah@dailysync.com" },
  { name: "Alex Mercer", email: "alex@dailysync.com" },
];

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
  const [isLoaded, setIsLoaded] = useState(false);

  // Modal control & date/staff states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [selectedStaffIndex, setSelectedStaffIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");

  // Dynamic Task Form Items state
  const [taskItems, setTaskItems] = useState<TaskFormItem[]>([
    {
      id: "item-init",
      projectId: staticProjects[0].id,
      taskName: "",
      status: "In Progress",
      priority: "Medium",
      hours: 1,
      minutes: 0,
    },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
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

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    try {
      localStorage.setItem("dailysync-tasks", JSON.stringify(newTasks));
    } catch (e) {
      console.warn("Could not save tasks to localStorage");
    }
  };

  const handleAddTaskRow = () => {
    setTaskItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        projectId: staticProjects[0].id,
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emptyTask = taskItems.find((t) => !t.taskName.trim());
    if (emptyTask) {
      alert("Please enter descriptions for all work activities.");
      return;
    }

    const staff = staticStaff[selectedStaffIndex];
    const newTasks: Task[] = taskItems.map((item, index) => {
      const project = staticProjects.find((p) => p.id === item.projectId);
      const totalMinutes = Number(item.hours) * 60 + Number(item.minutes);

      return {
        id: editingTaskId || `task-${Date.now()}-${index}`,
        taskName: item.taskName.trim(),
        userName: staff.name,
        userEmail: staff.email,
        startDate: selectedDate,
        endDate: selectedDate,
        totalMinutes,
        status: item.status,
        priority: item.priority,
        projectName: project?.name || "Unassigned Project",
      };
    });

    let updatedTasks;
    if (editingTaskId) {
      updatedTasks = tasks.map((t) => (t.id === editingTaskId ? newTasks[0] : t));
      setToastMessage("Task updated successfully!");
    } else {
      updatedTasks = [...newTasks, ...tasks];
      setToastMessage(`Logged ${newTasks.length} task entries successfully!`);
    }

    saveTasks(updatedTasks);
    setEditingTaskId(null);

    setTaskItems([
      {
        id: `item-${Date.now()}`,
        projectId: staticProjects[0].id,
        taskName: "",
        status: "Completed",
        priority: "Medium",
        hours: 1,
        minutes: 0,
      },
    ]);
    setIsModalOpen(false);

    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleEditTask = (task: Task) => {
    const project = staticProjects.find((p) => p.name === task.projectName) || staticProjects[0];

    setTaskItems([
      {
        id: `item-edit-${task.id}`,
        projectId: project.id,
        taskName: task.taskName,
        status: task.status,
        priority: task.priority,
        hours: Math.floor(task.totalMinutes / 60),
        minutes: task.totalMinutes % 60,
      }
    ]);
    setSelectedDate(task.endDate);
    setEditingTaskId(task.id);
    setIsModalOpen(true);
  };

  const handleRemoveTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    saveTasks(updatedTasks);
  };

  const currentStaff = staticStaff[selectedStaffIndex];

  const staffTasks = tasks.filter(
    (t) => t.userName.toLowerCase() === currentStaff.name.toLowerCase()
  );

  const groupedStaffTasks = useMemo(() => {
    const groups: { [date: string]: Task[] } = {};
    staffTasks.forEach((task) => {
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
  }, [staffTasks]);

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
          <div className="text-sm font-semibold text-theme-fg-muted animate-pulse">
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

        {/* Header section */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-theme-border pb-6">
          <div>
       
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-theme-fg">
              Task Reporting
            </h1>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Staff Profile selector */}
            <Select
              options={staticStaff.map((staff, idx) => ({
                value: String(idx),
                label: staff.name,
              }))}
              value={String(selectedStaffIndex)}
              onChange={(e) => setSelectedStaffIndex(Number(e.target.value))}
              className="!py-1.5 !text-xs"
            />

            {user?.role !== "admin" && (
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setEditingTaskId(null);
                  setTaskItems([
                    {
                      id: `item-init-${Date.now()}`,
                      projectId: staticProjects[0].id,
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
            )}
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
            {groupedStaffTasks.length > 0 ? (
              groupedStaffTasks.map((group) => (
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
                       
                        </div>

                        <div className="mt-4 flex items-center justify-between md:mt-0 md:gap-4">
                          <span
                            className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${getStatusBadge(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>

                          {user?.role !== "admin" && (
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
                          )}
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
                  No tasks logged by you yet. Click &quot;Report Tasks&quot; to
                  submit timesheets.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Log Task Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingTaskId ? "Edit Task" : "Daily Reporting"}
          size="xl"
        >
          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* Profile and Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-theme-bg-inset p-4 rounded-xl border border-theme-border">
              <div>
                <span className="block text-[10px] font-bold text-theme-fg-muted uppercase tracking-wider mb-1">
                  Staff
                </span>
                <div className="font-bold flex-col text-sm text-theme-fg">
                  {currentStaff.name}{" "}
                  <span className="font-normal text-xs text-theme-fg-secondary">
                    ({currentStaff.email})
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

              {taskItems.map((item, index) => (
                <div
                  key={item.id}
                  className="relative p-4 rounded-xl border border-theme-border bg-theme-bg-surface space-y-3"
                >


                  {/* Project & Task Name */}
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-3 items-end">
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

                    {/* Status */}
                    <Select
                      label="Status"
                      options={statusOptions}
                      value={item.status}
                      onChange={(e) =>
                        handleUpdateTaskItem(item.id, "status", e.target.value)
                      }
                    />

                    {/* Delete */}
                    <div className="flex items-end h-full pb-1">
                      {taskItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTaskRow(item.id)}
                          className="h-10 w-10 flex items-center justify-center text-red-500  transition cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
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
                  <span>Add task </span>
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
              <Button type="submit" variant="primary">
                {editingTaskId ? "Update Task" : "Submit Report"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Sidebar>
  );
}

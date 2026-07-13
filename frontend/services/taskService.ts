import axiosInstance from "../lib/axiosInstance";

// ── Task type (matches both backend response and frontend UI) ─────────────────
export interface Task {
  id: string;         // mapped from _id
  _id: string;
  taskName: string;
  userName: string;   // populated from userId.name
  userEmail: string;  // populated from userId.email
  startDate: string;
  endDate: string;
  totalMinutes: number;
  status: "Completed" | "In Progress" | "Pending" | "Blocked";
  priority: "Low" | "Medium" | "High";
  projectName?: string;
}

export interface CreateTaskPayload {
  taskName: string;
  startDate: string;
  endDate: string;
  totalMinutes: number;
  status: "Completed" | "In Progress" | "Pending" | "Blocked";
  priority: "Low" | "Medium" | "High";
  projectId?: string;
}

// Normalize backend response → frontend Task shape
const normalizeTask = (raw: any): Task => ({
  id: raw._id,
  _id: raw._id,
  taskName: raw.taskName || "",
  userName: raw.userId?.name || "Unknown",
  userEmail: raw.userId?.email || "",
  startDate: raw.startDate ? raw.startDate.split("T")[0] : "",
  endDate: raw.endDate ? raw.endDate.split("T")[0] : "",
  totalMinutes: raw.totalMinutes || 0,
  status: raw.status || "Pending",
  priority: raw.priority || "Medium",
  projectName: raw.projectId?.name || "Unassigned Project",
});

/** GET /api/tasks — fetch all tasks */
export const fetchTasks = async (): Promise<Task[]> => {
  const response = await axiosInstance.get("/tasks");
  const raw: any[] = response.data.data || [];
  return raw.map(normalizeTask);
};

/** POST /api/tasks — create a new task */
export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const response = await axiosInstance.post("/tasks", payload);
  return normalizeTask(response.data.data);
};

/** PUT /api/tasks/:id — update a task */
export const updateTask = async (
  id: string,
  payload: Partial<CreateTaskPayload>
): Promise<Task> => {
  const response = await axiosInstance.put(`/tasks/${id}`, payload);
  return normalizeTask(response.data.data);
};

/** DELETE /api/tasks/:id — delete a task */
export const deleteTask = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/tasks/${id}`);
};

// ── Dashboard Stats ─────────────────────────────────────────────────────────

export interface DashboardStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  blocked: number;
  totalMinutes: number;
}

/** GET /api/tasks/dashboard — fetch dashboard statistics */
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axiosInstance.get("/tasks/dashboard");
  return response.data.data as DashboardStats;
};

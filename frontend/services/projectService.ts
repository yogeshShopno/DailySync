import axiosInstance from "../lib/axiosInstance";
import { Department } from "./departmentService";

export interface Project {
  _id: string;
  name: string;
  description: string;
  departmentId: Department | null;
  status: "Active" | "Inactive" | "Completed";
  createdAt: string;
  updatedAt: string;
}

export interface ProjectPayload {
  name: string;
  description: string;
  departmentId: string | null;
  status: "Active" | "Inactive" | "Completed";
}

export const projectService = {
  fetchProjects: async (): Promise<Project[]> => {
    const response = await axiosInstance.get("/projects");
    return response.data.data;
  },
  createProject: async (data: Partial<ProjectPayload>): Promise<Project> => {
    const response = await axiosInstance.post("/projects", data);
    return response.data.data;
  },
  updateProject: async (id: string, data: Partial<ProjectPayload>): Promise<Project> => {
    const response = await axiosInstance.put(`/projects/${id}`, data);
    return response.data.data;
  },
  deleteProject: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/projects/${id}`);
  }
};

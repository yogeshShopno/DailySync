import axiosInstance from "../lib/axiosInstance";
import { Role } from "./roleService";
import { Department } from "./departmentService";

export interface User {
  _id: string;
  name: string;
  email: string;
  roleId: Role | null;
  departmentId: Department | null;
  isAdmin: boolean;
  status: boolean;
  createdAt: string;
}

export interface UserPayload {
  name: string;
  email: string;
  password?: string;
  roleId: string | null;
  departmentId: string | null;
  isAdmin: boolean;
  status: boolean;
}

export const userService = {
  fetchUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get("/users");
    return response.data.data;
  },
  createUser: async (data: Partial<UserPayload>): Promise<User> => {
    const response = await axiosInstance.post("/users", data);
    return response.data.data;
  },
  updateUser: async (id: string, data: Partial<UserPayload>): Promise<User> => {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data.data;
  },
  deleteUser: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },
  assignRole: async (id: string, roleId: string): Promise<User> => {
    const response = await axiosInstance.put(`/users/${id}/role`, { roleId });
    return response.data.data;
  },
  assignDepartment: async (id: string, departmentId: string): Promise<User> => {
    const response = await axiosInstance.put(`/users/${id}/department`, { departmentId });
    return response.data.data;
  }
};

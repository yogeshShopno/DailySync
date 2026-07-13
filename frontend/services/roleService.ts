import axiosInstance from "../lib/axiosInstance";
import { Permission } from "./permissionService";

export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export const roleService = {
  fetchRoles: async (): Promise<Role[]> => {
    const response = await axiosInstance.get("/roles");
    return response.data.data;
  },
  createRole: async (data: Partial<Role>): Promise<Role> => {
    const response = await axiosInstance.post("/roles", data);
    return response.data.data;
  },
  updateRole: async (id: string, data: Partial<Role>): Promise<Role> => {
    const response = await axiosInstance.put(`/roles/${id}`, data);
    return response.data.data;
  },
  deleteRole: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/roles/${id}`);
  },
  assignPermissions: async (id: string, permissionIds: string[]): Promise<Role> => {
    const response = await axiosInstance.put(`/roles/${id}/permissions`, { permissions: permissionIds });
    return response.data.data;
  }
};

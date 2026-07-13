import axiosInstance from "../lib/axiosInstance";

export interface Permission {
  _id: string;
  name: string;
  module: string;
  description: string;
}

export const permissionService = {
  fetchPermissions: async (): Promise<Permission[]> => {
    const response = await axiosInstance.get("/permissions");
    return response.data.data;
  },
  createPermission: async (data: Partial<Permission>): Promise<Permission> => {
    const response = await axiosInstance.post("/permissions", data);
    return response.data.data;
  }
};

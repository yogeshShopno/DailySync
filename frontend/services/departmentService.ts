import axiosInstance from "../lib/axiosInstance";

export interface Department {
  _id: string;
  name: string;
  description: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export const departmentService = {
  fetchDepartments: async (): Promise<Department[]> => {
    const response = await axiosInstance.get("/departments");
    return response.data.data;
  },
  createDepartment: async (data: Partial<Department>): Promise<Department> => {
    const response = await axiosInstance.post("/departments", data);
    return response.data.data;
  },
  updateDepartment: async (id: string, data: Partial<Department>): Promise<Department> => {
    const response = await axiosInstance.put(`/departments/${id}`, data);
    return response.data.data;
  },
  deleteDepartment: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/departments/${id}`);
  }
};

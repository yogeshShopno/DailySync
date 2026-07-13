"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { departmentService, Department } from "../../../services/departmentService";
import { Plus, Edit2, Trash2 } from "lucide-react";
import FormError from "../../../components/ui/FormError";
import withAdminProtection from "../../../components/withAdminProtection";

function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDept, setEditDept] = useState<Department | null>(null);
  
  const [formData, setFormData] = useState({ name: "", description: "", status: true });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const data = await departmentService.fetchDepartments();
      setDepartments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      if (editDept) {
        await departmentService.updateDepartment(editDept._id, formData);
      } else {
        await departmentService.createDepartment(formData);
      }
      setIsModalOpen(false);
      loadDepartments();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Failed to save department.");
    }
  };

  const openModal = (dept?: Department) => {
    setFormError(null);
    if (dept) {
      setEditDept(dept);
      setFormData({ name: dept.name, description: dept.description, status: dept.status });
    } else {
      setEditDept(null);
      setFormData({ name: "", description: "", status: true });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        await departmentService.deleteDepartment(id);
        loadDepartments();
      } catch (err) {
        console.error("Error deleting", err);
      }
    }
  };

  if (loading) return (
    <Sidebar>
      <div className="p-6 text-theme-fg">Loading...</div>
    </Sidebar>
  );

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-theme-fg">Departments</h1>
            <p className="text-sm text-theme-fg-muted mt-1">Manage company departments</p>
          </div>
          <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-theme-primary px-4 py-2 text-sm font-semibold text-white hover:bg-theme-primary-hover"
        >
          <Plus className="h-4 w-4" />
          Add Department
        </button>
      </div>

      <div className="rounded-xl border border-theme-border bg-theme-bg-surface overflow-hidden">
        <table className="w-full text-left text-sm text-theme-fg">
          <thead className="bg-theme-bg text-theme-fg-muted uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Description</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-border">
            {departments.map((dept) => (
              <tr key={dept._id} className="hover:bg-theme-bg-surface-hover">
                <td className="px-6 py-4 font-medium">{dept.name}</td>
                <td className="px-6 py-4 text-theme-fg-muted">{dept.description}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${dept.status ? 'bg-theme-success/10 text-theme-success' : 'bg-theme-error/10 text-theme-error'}`}>
                    {dept.status ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center justify-end gap-3">
                  <button onClick={() => openModal(dept)} className="text-theme-fg-muted hover:text-theme-primary">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(dept._id)} className="text-theme-fg-muted hover:text-theme-error">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-theme-border bg-theme-bg-surface p-6 shadow-xl">
            <h2 className="text-xl font-bold text-theme-fg mb-4">
              {editDept ? "Edit Department" : "Add Department"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormError message={formError} />
              
              <div>
                <label className="mb-1 block text-sm font-medium text-theme-fg-muted">Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-theme-border bg-theme-bg px-3 py-2 text-theme-fg focus:border-theme-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-theme-fg-muted">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-theme-border bg-theme-bg px-3 py-2 text-theme-fg focus:border-theme-primary focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  className="h-4 w-4 rounded border-theme-border text-theme-primary focus:ring-theme-primary"
                />
                <label className="text-sm font-medium text-theme-fg">Active</label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-theme-fg hover:bg-theme-bg-surface-hover"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-theme-primary px-4 py-2 text-sm font-semibold text-white hover:bg-theme-primary-hover"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </Sidebar>
  );
}

export default withAdminProtection(DepartmentsPage);

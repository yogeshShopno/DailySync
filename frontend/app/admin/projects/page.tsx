"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { projectService, Project } from "../../../services/projectService";
import { departmentService, Department } from "../../../services/departmentService";
import { Plus, Edit2, Trash2 } from "lucide-react";
import FormError from "../../../components/ui/FormError";
import withAdminProtection from "../../../components/withAdminProtection";

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", departmentId: "", status: "Active" as "Active" | "Inactive" | "Completed" });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projData, deptData] = await Promise.all([
        projectService.fetchProjects(),
        departmentService.fetchDepartments()
      ]);
      setProjects(projData);
      setDepartments(deptData);
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
      if (editProject) {
        await projectService.updateProject(editProject._id, formData);
      } else {
        await projectService.createProject(formData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Failed to save project.");
    }
  };

  const openModal = (proj?: Project) => {
    setFormError(null);
    if (proj) {
      setEditProject(proj);
      setFormData({ 
        name: proj.name, 
        description: proj.description, 
        departmentId: proj.departmentId?._id || "", 
        status: proj.status 
      });
    } else {
      setEditProject(null);
      setFormData({ name: "", description: "", departmentId: "", status: "Active" });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await projectService.deleteProject(id);
        loadData();
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
            <h1 className="text-2xl font-bold text-theme-fg">Projects</h1>
            <p className="text-sm text-theme-fg-muted mt-1">Manage company projects and assignments</p>
          </div>
          <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-theme-primary px-4 py-2 text-sm font-semibold text-white hover:bg-theme-primary-hover"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      <div className="rounded-xl border border-theme-border bg-theme-bg-surface overflow-hidden">
        <table className="w-full text-left text-sm text-theme-fg">
          <thead className="bg-theme-bg text-theme-fg-muted uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Department</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-border">
            {projects.map((proj) => (
              <tr key={proj._id} className="hover:bg-theme-bg-surface-hover">
                <td className="px-6 py-4 font-medium">
                  {proj.name}
                  <div className="text-xs text-theme-fg-muted font-normal mt-0.5">{proj.description}</div>
                </td>
                <td className="px-6 py-4 text-theme-fg-muted">{proj.departmentId?.name || "None"}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    proj.status === 'Active' ? 'bg-theme-success/10 text-theme-success' : 
                    proj.status === 'Completed' ? 'bg-theme-primary/10 text-theme-primary' : 
                    'bg-theme-fg-muted/10 text-theme-fg-muted'
                  }`}>
                    {proj.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center justify-end gap-3">
                  <button onClick={() => openModal(proj)} className="text-theme-fg-muted hover:text-theme-primary">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(proj._id)} className="text-theme-fg-muted hover:text-theme-error">
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
              {editProject ? "Edit Project" : "Add Project"}
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
              <div>
                <label className="mb-1 block text-sm font-medium text-theme-fg-muted">Department</label>
                <select
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="w-full rounded-lg border border-theme-border bg-theme-bg px-3 py-2 text-theme-fg focus:border-theme-primary focus:outline-none"
                >
                  <option value="">Select Department</option>
                  {departments.map(d => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-theme-fg-muted">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full rounded-lg border border-theme-border bg-theme-bg px-3 py-2 text-theme-fg focus:border-theme-primary focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Completed">Completed</option>
                </select>
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

export default withAdminProtection(ProjectsPage);

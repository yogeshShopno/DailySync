"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { roleService, Role } from "../../../services/roleService";
import { permissionService, Permission } from "../../../services/permissionService";
import { Plus, Edit2, Trash2, Shield } from "lucide-react";
import FormError from "../../../components/ui/FormError";
import withAdminProtection from "../../../components/withAdminProtection";

function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rData, pData] = await Promise.all([
        roleService.fetchRoles(),
        permissionService.fetchPermissions()
      ]);
      setRoles(rData);
      setAllPermissions(pData);
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
      if (editRole) {
        await roleService.updateRole(editRole._id, formData);
      } else {
        await roleService.createRole(formData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Failed to save role.");
    }
  };

  const handlePermSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRole) return;
    try {
      await roleService.assignPermissions(editRole._id, selectedPerms);
      setIsPermModalOpen(false);
      loadData();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Failed to save permissions.");
    }
  };

  const openModal = (role?: Role) => {
    setFormError(null);
    if (role) {
      setEditRole(role);
      setFormData({ name: role.name, description: role.description });
    } else {
      setEditRole(null);
      setFormData({ name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const openPermModal = (role: Role) => {
    setEditRole(role);
    setSelectedPerms(role.permissions.map(p => p._id));
    setIsPermModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this role?")) {
      try {
        await roleService.deleteRole(id);
        loadData();
      } catch (err) {
        console.error("Error deleting", err);
      }
    }
  };

  // Group permissions by module
  const permsByModule = allPermissions.reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

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
            <h1 className="text-2xl font-bold text-theme-fg">Roles & Permissions</h1>
            <p className="text-sm text-theme-fg-muted mt-1">Manage user roles and access control</p>
          </div>
          <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-theme-primary px-4 py-2 text-sm font-semibold text-white hover:bg-theme-primary-hover"
        >
          <Plus className="h-4 w-4" />
          Add Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map(role => (
          <div key={role._id} className="rounded-xl border border-theme-border bg-theme-bg-surface p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-theme-fg">{role.name}</h3>
                <p className="text-sm text-theme-fg-muted mt-1">{role.description || "No description"}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openModal(role)} className="p-1.5 text-theme-fg-muted hover:text-theme-primary rounded">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(role._id)} className="p-1.5 text-theme-fg-muted hover:text-theme-error rounded">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-auto pt-4 border-t border-theme-border flex items-center justify-between">
              <span className="text-xs font-medium text-theme-fg-muted bg-theme-bg px-2.5 py-1 rounded-full">
                {role.permissions.length} Permissions
              </span>
              <button 
                onClick={() => openPermModal(role)}
                className="text-xs font-semibold text-theme-primary hover:text-theme-primary-hover flex items-center gap-1"
              >
                <Shield className="h-3 w-3" />
                Manage Access
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-theme-border bg-theme-bg-surface p-6 shadow-xl">
            <h2 className="text-xl font-bold text-theme-fg mb-4">
              {editRole ? "Edit Role" : "Add Role"}
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
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-theme-fg hover:bg-theme-bg-surface-hover">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-theme-primary px-4 py-2 text-sm font-semibold text-white hover:bg-theme-primary-hover">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPermModalOpen && editRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl border border-theme-border bg-theme-bg-surface p-6 shadow-xl max-h-[90vh] flex flex-col">
            <h2 className="text-xl font-bold text-theme-fg mb-4">
              Manage Permissions: {editRole.name}
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {Object.entries(permsByModule).map(([module, perms]) => (
                <div key={module}>
                  <h3 className="text-sm font-bold text-theme-fg capitalize border-b border-theme-border pb-2 mb-3">
                    {module}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {perms.map(perm => (
                      <label key={perm._id} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedPerms.includes(perm._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPerms(prev => [...prev, perm._id]);
                            } else {
                              setSelectedPerms(prev => prev.filter(id => id !== perm._id));
                            }
                          }}
                          className="h-4 w-4 rounded border-theme-border text-theme-primary focus:ring-theme-primary"
                        />
                        <div>
                          <p className="text-sm font-medium text-theme-fg group-hover:text-theme-primary transition-colors">{perm.description}</p>
                          <p className="text-[10px] text-theme-fg-muted font-mono">{perm.name}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-theme-border">
              <button type="button" onClick={() => setIsPermModalOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-theme-fg hover:bg-theme-bg-surface-hover">
                Cancel
              </button>
              <button onClick={handlePermSubmit} className="rounded-lg bg-theme-primary px-4 py-2 text-sm font-semibold text-white hover:bg-theme-primary-hover">
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </Sidebar>
  );
}

export default withAdminProtection(RolesPage);

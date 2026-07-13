"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { userService, User } from "../../../services/userService";
import { roleService, Role } from "../../../services/roleService";
import { departmentService, Department } from "../../../services/departmentService";
import { Plus, Edit2, Trash2 } from "lucide-react";
import FormError from "../../../components/ui/FormError";
import withAdminProtection from "../../../components/withAdminProtection";

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<UserPayload>>({ name: "", email: "", password: "", roleId: "", departmentId: "", isAdmin: false, status: true });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [uData, rData, dData] = await Promise.all([
        userService.fetchUsers(),
        roleService.fetchRoles(),
        departmentService.fetchDepartments()
      ]);
      setUsers(uData);
      setRoles(rData);
      setDepartments(dData);
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
      if (editUser) {
        // Only send password if it was entered
        const data = { ...formData };
        if (!data.password) delete (data as any).password;
        await userService.updateUser(editUser._id, data);
      } else {
        await userService.createUser(formData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Failed to save user.");
    }
  };

  const openModal = (user?: User) => {
    setFormError(null);
    if (user) {
      setEditUser(user);
      setFormData({ 
        name: user.name, 
        email: user.email, 
        password: "", // Don't populate password field
        roleId: user.roleId?._id || "", 
        departmentId: user.departmentId?._id || "", 
        isAdmin: user.isAdmin,
        status: user.status 
      });
    } else {
      setEditUser(null);
      setFormData({ name: "", email: "", password: "", roleId: "", departmentId: "", isAdmin: false, status: true });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.deleteUser(id);
        loadData();
      } catch (err) {
        console.error("Error deleting", err);
      }
    }
  };

  const handleRoleChange = async (userId: string, roleId: string) => {
    try {
      await userService.assignRole(userId, roleId);
      loadData();
    } catch (err) {
      console.error("Error assigning role", err);
    }
  };

  const handleDeptChange = async (userId: string, deptId: string) => {
    try {
      await userService.assignDepartment(userId, deptId);
      loadData();
    } catch (err) {
      console.error("Error assigning department", err);
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
            <h1 className="text-2xl font-bold text-theme-fg">Users</h1>
            <p className="text-sm text-theme-fg-muted mt-1">Manage system users, roles, and departments</p>
          </div>
          <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-theme-primary px-4 py-2 text-sm font-semibold text-white hover:bg-theme-primary-hover"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      <div className="rounded-xl border border-theme-border bg-theme-bg-surface overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-theme-fg">
            <thead className="bg-theme-bg text-theme-fg-muted uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">User</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Role</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Department</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Status</th>
                <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-border">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-theme-bg-surface-hover">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-theme-gradient-start to-theme-gradient-end text-xs font-bold text-white shadow-sm">
                        {user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {user.name}
                          {user.isAdmin && (
                            <span className="bg-theme-warning/10 text-theme-warning text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                              Sys Admin
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-theme-fg-muted mt-0.5">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.roleId?._id || ""}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="bg-transparent border border-theme-border rounded px-2 py-1 text-sm focus:border-theme-primary focus:outline-none"
                    >
                      <option value="">No Role</option>
                      {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.departmentId?._id || ""}
                      onChange={(e) => handleDeptChange(user._id, e.target.value)}
                      className="bg-transparent border border-theme-border rounded px-2 py-1 text-sm focus:border-theme-primary focus:outline-none"
                    >
                      <option value="">No Department</option>
                      {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      user.status ? 'bg-theme-success/10 text-theme-success' : 'bg-theme-error/10 text-theme-error'
                    }`}>
                      {user.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center justify-end gap-3">
                    <button onClick={() => openModal(user)} className="text-theme-fg-muted hover:text-theme-primary transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="text-theme-fg-muted hover:text-theme-error transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-theme-border bg-theme-bg-surface p-6 shadow-xl">
            <h2 className="text-xl font-bold text-theme-fg mb-4">
              {editUser ? "Edit User" : "Add User"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormError message={formError} />
              <div className="grid grid-cols-2 gap-4">
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
                  <label className="mb-1 block text-sm font-medium text-theme-fg-muted">Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-theme-border bg-theme-bg px-3 py-2 text-theme-fg focus:border-theme-primary focus:outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-theme-fg-muted">
                  Password {editUser && <span className="text-xs font-normal opacity-70">(Leave blank to keep unchanged)</span>}
                </label>
                <input
                  required={!editUser}
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-lg border border-theme-border bg-theme-bg px-3 py-2 text-theme-fg focus:border-theme-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-theme-fg-muted">Role</label>
                  <select
                    value={formData.roleId}
                    onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                    className="w-full rounded-lg border border-theme-border bg-theme-bg px-3 py-2 text-theme-fg focus:border-theme-primary focus:outline-none"
                  >
                    <option value="">Select Role</option>
                    {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-theme-fg-muted">Department</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full rounded-lg border border-theme-border bg-theme-bg px-3 py-2 text-theme-fg focus:border-theme-primary focus:outline-none"
                  >
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAdmin}
                    onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                    className="h-4 w-4 rounded border-theme-border text-theme-primary focus:ring-theme-primary"
                  />
                  <span className="text-sm font-medium text-theme-fg">System Admin (Bypasses roles)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                    className="h-4 w-4 rounded border-theme-border text-theme-primary focus:ring-theme-primary"
                  />
                  <span className="text-sm font-medium text-theme-fg">Active Account</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-theme-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-theme-fg hover:bg-theme-bg-surface-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-theme-primary px-4 py-2 text-sm font-semibold text-white hover:bg-theme-primary-hover transition-colors shadow-sm"
                >
                  Save User
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

export default withAdminProtection(UsersPage);

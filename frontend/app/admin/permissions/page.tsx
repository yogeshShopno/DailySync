"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { permissionService, Permission } from "../../../services/permissionService";
import { ShieldAlert } from "lucide-react";
import withAdminProtection from "../../../components/withAdminProtection";

function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const pData = await permissionService.fetchPermissions();
      setPermissions(pData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl font-bold text-theme-fg">System Permissions</h1>
            <p className="text-sm text-theme-fg-muted mt-1">Read-only view of available system permissions</p>
          </div>
        </div>

      <div className="rounded-xl border border-theme-border bg-theme-bg-surface p-6 flex items-start gap-4 mb-6">
        <div className="p-3 bg-theme-warning/10 text-theme-warning rounded-lg">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold text-theme-fg">Managed by System</h3>
          <p className="text-sm text-theme-fg-muted mt-1">
            Permissions are hardcoded into the application's source code to match specific API routes and UI elements. 
            They are seeded into the database and should only be changed by developers.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-theme-border bg-theme-bg-surface overflow-hidden">
        <table className="w-full text-left text-sm text-theme-fg">
          <thead className="bg-theme-bg text-theme-fg-muted uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold">Key Name</th>
              <th className="px-6 py-4 font-semibold">Module</th>
              <th className="px-6 py-4 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-border">
            {permissions.map((perm) => (
              <tr key={perm._id} className="hover:bg-theme-bg-surface-hover">
                <td className="px-6 py-4 font-mono text-xs">{perm.name}</td>
                <td className="px-6 py-4 capitalize">
                  <span className="bg-theme-bg px-2.5 py-1 rounded-full text-xs font-semibold text-theme-fg-muted">
                    {perm.module}
                  </span>
                </td>
                <td className="px-6 py-4 text-theme-fg-muted">{perm.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </Sidebar>
  );
}

export default withAdminProtection(PermissionsPage);

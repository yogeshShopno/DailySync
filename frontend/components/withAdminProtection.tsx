"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function withAdminProtection(WrappedComponent: React.ComponentType<any>) {
  return function ProtectedRoute(props: any) {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      // If auth isn't resolved yet (user is null but maybe restoring from local storage), we might need to wait.
      // But in this simple app, user is populated by Context immediately if in localStorage.
      if (!user) {
        router.replace("/");
        return;
      }

      const isSuperAdmin = user.isAdmin || user.role === "admin" || user.role === "Admin";
      if (!isSuperAdmin) {
        router.replace("/");
      } else {
        setIsChecking(false);
      }
    }, [user, router]);

    if (isChecking) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-theme-bg">
          <div className="flex items-center gap-2 text-theme-fg-muted font-medium">
            <Loader2 className="h-5 w-5 animate-spin text-theme-primary" />
            Checking permissions...
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

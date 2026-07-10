"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "admin" | "staff";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string; // initials
}

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

/* ─── Static Users ─── */
export const MOCK_USERS: (AppUser & { password: string })[] = [
  {
    id: "user-1",
    name: "Yogesh Jain",
    email: "admin@dailysync.com",
    role: "admin",
    avatar: "YJ",
    password: "admin123",
  },
  {
    id: "user-2",
    name: "Sarah Connor",
    email: "staff@dailysync.com",
    role: "staff",
    avatar: "SC",
    password: "staff123",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("dailysync-auth");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("dailysync-auth");
      }
    }
    setLoaded(true);
  }, []);

  const login = (email: string, password: string) => {
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return { success: false, error: "Invalid email or password" };
    }
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem("dailysync-auth", JSON.stringify(safeUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dailysync-auth");
  };

  // Don't render children until we've checked localStorage to prevent flash
  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-theme-bg">
        <div className="flex items-center gap-2 text-sm font-semibold text-theme-fg-muted animate-pulse">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading DailySync...
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

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
    try {
      const stored = localStorage.getItem("dailysync-auth");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (error) {
      console.warn("Could not read auth from localStorage:", error);
    } finally {
      setLoaded(true);
    }
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
    try {
      localStorage.setItem("dailysync-auth", JSON.stringify(safeUser));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("dailysync-auth");
    } catch (e) {
      console.warn("Could not remove from localStorage", e);
    }
  };

  // Temporarily removed the !loaded check to ensure the app renders even if useEffect fails to fire
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

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginUser } from "../services/authService";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string; // initials derived from name
  isAdmin: boolean;
  permissions: string[];
}

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// Quick-login display cards (no passwords — just for UI buttons)
export const QUICK_LOGIN_CARDS = [
  {
    id: "card-admin",
    name: "Admin User",
    email: "admin@dailysync.com",
    password: "Admin@123",
    role: "admin",
    avatar: "AD",
  },
  {
    id: "card-staff",
    name: "Staff User",
    email: "staff@dailysync.com",
    password: "Staff@123",
    role: "staff",
    avatar: "ST",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dailysync-auth");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (error) {
      console.warn("Could not read auth from localStorage:", error);
    }
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const data = await loginUser(email, password);

      // Derive initials from name
      const initials = (data.user.name || "?")
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);

      const roleName = data.user.role || (data.user.isAdmin ? "admin" : "staff");

      const appUser: AppUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: roleName.toLowerCase(),
        avatar: initials,
        isAdmin: data.user.isAdmin,
        permissions: data.user.permissions || [],
      };

      setUser(appUser);

      // Persist user profile and token separately
      localStorage.setItem("dailysync-auth", JSON.stringify(appUser));
      localStorage.setItem("dailysync-token", data.token);

      return { success: true };
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Login failed. Please check your credentials.";
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("dailysync-auth");
      localStorage.removeItem("dailysync-token");
    } catch (e) {
      console.warn("Could not remove from localStorage", e);
    }
  };

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

"use client";

import React, { useState } from "react";
import { useAuth, MOCK_USERS } from "../context/AuthContext";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { Lock, Mail, Zap, Shield, User } from "lucide-react";

export default function LoginPanel() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    // Simulate network delay for better UX
    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setError(result.error || "Login failed");
      }
      setIsLoading(false);
    }, 500);
  };

  const handleQuickLogin = (mockEmail: string, mockPassword: string) => {
    setEmail(mockEmail);
    setPassword(mockPassword);
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      const result = login(mockEmail, mockPassword);
      if (!result.success) {
        setError(result.error || "Login failed");
      }
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-theme-bg px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Brand header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-theme-gradient-start to-theme-gradient-end text-xl font-bold text-white shadow-lg">
            DS
          </div>
          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-theme-fg">
            Welcome to DailySync
          </h1>
          <p className="mt-2 text-sm text-theme-fg-secondary">
            Sign in with your credentials to access your workspace
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-theme-border bg-theme-bg-surface p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@dailysync.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                error={error && !email.trim() ? "Email is required" : undefined}
              />
              <Mail className="absolute right-3 top-[34px] h-4 w-4 text-theme-fg-muted pointer-events-none" />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                error={
                  error && email.trim() && !password.trim()
                    ? "Password is required"
                    : undefined
                }
              />
              <Lock className="absolute right-3 top-[34px] h-4 w-4 text-theme-fg-muted pointer-events-none" />
            </div>

            {/* Global error */}
            {error && email.trim() && password.trim() && (
              <div className="flex items-center gap-2 rounded-lg bg-theme-error-bg border border-theme-error/20 px-3 py-2.5 text-xs font-medium text-theme-error-fg">
                <svg className="h-4 w-4 text-theme-error flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-theme-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-theme-bg-surface px-3 text-xs font-medium text-theme-fg-muted">
                Quick Access
              </span>
            </div>
          </div>

          {/* Quick login buttons */}
          <div className="grid grid-cols-2 gap-3">
            {MOCK_USERS.map((mockUser) => (
              <button
                key={mockUser.id}
                onClick={() => handleQuickLogin(mockUser.email, mockUser.password)}
                disabled={isLoading}
                className="group flex flex-col items-center gap-2 rounded-xl border border-theme-border p-4 transition-all duration-150 hover:border-theme-primary hover:bg-theme-primary-bg cursor-pointer disabled:opacity-50"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                    mockUser.role === "admin"
                      ? "bg-theme-warning-bg text-theme-warning-fg"
                      : "bg-theme-primary-bg text-theme-primary-fg"
                  }`}
                >
                  {mockUser.avatar}
                </div>
                <span className="text-xs font-semibold text-theme-fg group-hover:text-theme-primary">
                  {mockUser.name}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-theme-fg-muted">
                  {mockUser.role === "admin" ? (
                    <Shield className="h-3 w-3" />
                  ) : (
                    <User className="h-3 w-3" />
                  )}
                  <span className="capitalize">{mockUser.role}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-theme-fg-muted">
          Use the Quick Access buttons above for instant demo login
        </p>
      </div>
    </div>
  );
}

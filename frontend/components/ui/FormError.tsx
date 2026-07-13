import React from "react";
import { AlertTriangle } from "lucide-react";

interface FormErrorProps {
  message: string | null;
}

export default function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 rounded-lg bg-theme-error/10 px-3 py-2 text-sm text-theme-error mb-4">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

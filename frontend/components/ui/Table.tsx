"use client";

import React from "react";

/* ─── Table Root ─── */
interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className = "" }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-theme-border">
      <table className={`w-full text-sm ${className}`}>{children}</table>
    </div>
  );
}

/* ─── Table Header ─── */
export function TableHeader({ children, className = "" }: TableProps) {
  return (
    <thead className={`bg-theme-bg-inset ${className}`}>{children}</thead>
  );
}

/* ─── Table Body ─── */
export function TableBody({ children, className = "" }: TableProps) {
  return <tbody className={`divide-y divide-theme-border ${className}`}>{children}</tbody>;
}

/* ─── Table Row ─── */
interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function TableRow({ children, className = "", onClick }: TableRowProps) {
  return (
    <tr
      className={`transition-colors hover:bg-theme-bg-surface-hover ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

/* ─── Table Head Cell ─── */
interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function TableHead({ children, className = "", onClick }: TableCellProps) {
  return (
    <th
      className={`px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-theme-fg-muted ${onClick ? "cursor-pointer select-none hover:text-theme-fg" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </th>
  );
}

/* ─── Table Data Cell ─── */
export function TableCell({ children, className = "" }: TableCellProps) {
  return (
    <td className={`px-4 py-3 text-theme-fg-secondary ${className}`}>
      {children}
    </td>
  );
}

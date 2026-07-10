"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from "lucide-react";

interface CalendarPickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
}

export default function CalendarPicker({ value, onChange }: CalendarPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Track current month/year being viewed
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const parts = value.split("-");
      if (parts.length === 3) return new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
    }
    return new Date();
  });

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleSelectDate = (day: number) => {
    const y = currentYear;
    const m = String(currentMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    onChange(`${y}-${m}-${d}`);
    setIsOpen(false);
  };

  // Generate grid cells
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const formatDisplay = () => {
    if (!value) return "Select date";
    const parts = value.split("-");
    if (parts.length === 3) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    return "Select date";
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div className="relative z-10" ref={popoverRef}>
      <div 
        className="flex items-center gap-2 cursor-pointer bg-theme-bg-surface border border-theme-border rounded-lg py-1.5 px-3 hover:border-theme-border-focus focus-within:border-theme-border-focus focus-within:ring-2 focus-within:ring-theme-ring transition-colors shadow-sm min-w-[140px] justify-between"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
      >
        <span className={`text-xs font-medium ${value ? 'text-theme-fg' : 'text-theme-fg-muted'}`}>
          {formatDisplay()}
        </span>
        <CalendarIcon className="h-4 w-4 text-theme-fg-muted" />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-theme-bg-surface border border-theme-border rounded-xl shadow-2xl z-50 w-72">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={handlePrevMonth}
              className="p-1 hover:bg-theme-bg-surface-hover rounded-lg transition-colors text-theme-fg-muted hover:text-theme-fg"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-sm font-bold text-theme-fg">
              {monthNames[currentMonth]} {currentYear}
            </div>
            <button 
              onClick={handleNextMonth}
              className="p-1 hover:bg-theme-bg-surface-hover rounded-lg transition-colors text-theme-fg-muted hover:text-theme-fg"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-theme-fg-muted uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {blanks.map(b => (
              <div key={`blank-${b}`} className="h-8 w-8" />
            ))}
            {days.map(d => {
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
              const isSelected = value === dateStr;
              const isToday = todayStr === dateStr;
              
              return (
                <button
                  key={d}
                  onClick={() => handleSelectDate(d)}
                  className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all duration-200
                    ${isSelected 
                      ? 'bg-theme-primary text-theme-primary-fg shadow-md scale-105' 
                      : isToday 
                        ? 'bg-theme-bg-inset text-theme-primary font-bold hover:bg-theme-bg-surface-hover'
                        : 'text-theme-fg hover:bg-theme-bg-surface-hover'
                    }
                  `}
                >
                  {d}
                </button>
              );
            })}
          </div>
          
          {value && (
            <div className="mt-4 pt-3 border-t border-theme-border flex justify-center">
              <button 
                onClick={() => {
                  onChange(null);
                  setIsOpen(false);
                }}
                className="text-xs font-medium text-theme-error hover:text-theme-error-fg transition-colors px-3 py-1.5 rounded-lg hover:bg-theme-error-bg"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

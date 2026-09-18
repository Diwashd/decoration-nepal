'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface MultiDatePickerProps {
  label: string;
  icon: string;
  selectedDates: string[];
  onChange: (dates: string[]) => void;
  placeholder?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatDisplayDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export default function MultiDatePicker({
  label,
  icon,
  selectedDates,
  onChange,
  placeholder = 'Select dates...',
}: MultiDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const updateMenuPosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const width = Math.min(Math.max(rect.width, 280), window.innerWidth - 24);
      const left = Math.min(
        Math.max(rect.left + window.scrollX, window.scrollX + 12),
        window.scrollX + window.innerWidth - width - 12,
      );
      setMenuStyle({
        position: 'absolute',
        top: `${rect.bottom + window.scrollY + 8}px`,
        left: `${left}px`,
        width: `${width}px`,
        zIndex: 9999,
      });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      updateMenuPosition();
      window.addEventListener('resize', updateMenuPosition);
      return () => {
        window.removeEventListener('resize', updateMenuPosition);
      };
    }
  }, [isOpen, updateMenuPosition]);

  const toggleDate = (dateStr: string) => {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    if (date < today) return;

    if (selectedDates.includes(dateStr)) {
      onChange(selectedDates.filter(d => d !== dateStr));
    } else {
      onChange([...selectedDates, dateStr]);
    }
  };

  const removeDate = (dateStr: string) => {
    onChange(selectedDates.filter(d => d !== dateStr));
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  return (
    <div className="flex flex-col relative" ref={dropdownRef}>
      {/* Label */}
      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-1.5">
        <span className="text-sm">{icon}</span> {label}
      </label>

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => {
          if (!isOpen) updateMenuPosition();
          setIsOpen(!isOpen);
        }}
        className={`
          w-full flex items-center justify-between gap-2
          bg-surface-container-lowest rounded-xl px-4 py-3.5
          border transition-all duration-200
          ${isOpen
            ? 'border-primary shadow-lg shadow-primary/10'
            : selectedDates.length > 0
              ? 'border-primary/40'
              : 'border-outline-variant/60 hover:border-primary/40 hover:shadow-md'
          }
        `}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
          {selectedDates.length > 0 ? (
            selectedDates.slice(0, 3).map(d => (
              <span key={d} className="inline-flex items-center gap-1 bg-primary/15 text-primary text-[11px] font-semibold px-2 py-0.5 rounded-full">
                {formatDisplayDate(d)}
                <span onClick={(e) => { e.stopPropagation(); removeDate(d); }} className="cursor-pointer hover:text-on-surface">
                  <X className="w-3 h-3" />
                </span>
              </span>
            ))
          ) : (
            <span className="text-on-surface-variant text-sm">{placeholder}</span>
          )}
          {selectedDates.length > 3 && (
            <span className="text-[11px] text-primary font-semibold">+{selectedDates.length - 3} more</span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-on-surface-variant transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Calendar Menu — rendered via portal */}
      {isOpen && createPortal(
        <div
          style={menuStyle}
          className="bg-surface-container-high border border-outline-variant/60 rounded-xl shadow-2xl shadow-black/40 animate-in fade-in duration-150 p-3"
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-2">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold text-cream-contrast">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {DAYS.map(day => (
              <div key={day} className="text-center text-[9px] font-bold text-on-surface-variant/60 uppercase py-0.5">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = formatDate(viewYear, viewMonth, day);
              const date = new Date(viewYear, viewMonth, day);
              date.setHours(0, 0, 0, 0);
              const isPast = date < today;
              const isSelected = selectedDates.includes(dateStr);
              const isToday = date.getTime() === today.getTime();

              return (
                <button
                  key={day}
                  onClick={() => toggleDate(dateStr)}
                  disabled={isPast}
                  className={`
                    w-full aspect-square flex items-center justify-center rounded-md text-xs transition-all duration-150
                    ${isPast ? 'text-on-surface-variant/30 cursor-not-allowed' : 'cursor-pointer hover:bg-primary/10'}
                    ${isSelected ? 'bg-primary text-on-primary font-bold shadow-sm shadow-primary/20' : ''}
                    ${isToday && !isSelected ? 'ring-1 ring-primary text-primary font-semibold' : ''}
                    ${!isSelected && !isPast ? 'text-on-surface-variant hover:text-cream-contrast' : ''}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Selected dates summary */}
          {selectedDates.length > 0 && (
            <div className="mt-2 pt-2 border-t border-outline-variant/30">
              <p className="text-[10px] text-on-surface-variant mb-1.5 font-semibold">{selectedDates.length} date{selectedDates.length > 1 ? 's' : ''} selected</p>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {selectedDates.sort().map(d => (
                  <span key={d} className="inline-flex items-center gap-0.5 bg-primary/15 text-primary text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                    {formatDisplayDate(d)}
                    <span onClick={() => removeDate(d)} className="cursor-pointer hover:text-on-surface ml-0.5">
                      <X className="w-2.5 h-2.5" />
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

// Re-export ChevronDown for the trigger
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

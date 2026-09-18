'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { createPortal } from 'react-dom';

interface CustomDropdownProps {
  label: string;
  icon: string;
  value: string;
  options: { value: string; label: string; sublabel?: string; icon?: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CustomDropdown({
  label,
  icon,
  value,
  options,
  onChange,
  placeholder = 'Select...',
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeOption, setActiveOption] = useState<string | null>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const selected = options.find(o => o.value === value);

  const updateMenuPosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuStyle({
        position: 'absolute',
        top: `${rect.bottom + window.scrollY + 8}px`,
        left: `${rect.left + window.scrollX}px`,
        width: `${rect.width}px`,
        zIndex: 9999,
      });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
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
      // Auto-scroll to selected item
      requestAnimationFrame(() => {
        const selectedBtn = optionRefs.current.get(value);
        if (selectedBtn && listRef.current) {
          selectedBtn.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      });
      return () => {
        window.removeEventListener('resize', updateMenuPosition);
      };
    }
  }, [isOpen, updateMenuPosition, value]);

  const selectOption = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const moveActiveOption = (direction: 1 | -1) => {
    if (options.length === 0) return;
    const activeIndex = Math.max(0, options.findIndex(option => option.value === activeOption));
    const nextIndex = (activeIndex + direction + options.length) % options.length;
    const nextValue = options[nextIndex].value;
    setActiveOption(nextValue);
    optionRefs.current.get(nextValue)?.focus();
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col relative" ref={dropdownRef}>
      {/* Label */}
      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
        <span className="text-sm">{icon}</span> {label}
      </label>

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => {
          if (!isOpen) {
            updateMenuPosition();
            setActiveOption(value || options[0]?.value || null);
          }
          setIsOpen(!isOpen);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (!isOpen) {
              setActiveOption(value || options[0]?.value || null);
              setIsOpen(true);
            } else {
              moveActiveOption(e.key === 'ArrowDown' ? 1 : -1);
            }
          }
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`
          w-full flex items-center justify-between gap-2
          bg-surface-container-lowest rounded-xl px-4 py-3.5
          border transition-all duration-200
          ${isOpen
            ? 'border-primary shadow-lg shadow-primary/10'
            : value
              ? 'border-primary/40'
              : 'border-outline-variant/60 hover:border-primary/40 hover:shadow-md'
          }
        `}
      >
        <div className="flex items-center gap-1.5 min-w-0 truncate">
          {selected ? (
            <>
              {selected.icon && <span className="text-sm">{selected.icon}</span>}
              <span className="text-cream-contrast text-sm font-semibold truncate">{selected.label}</span>
            </>
          ) : (
            <span className="text-on-surface-variant text-base truncate">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-on-surface-variant transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu — rendered via portal to escape all parent overflow */}
      {isOpen && createPortal(
        <div
          ref={menuRef}
          style={menuStyle}
          className="bg-surface-container-high border border-outline-variant/60 rounded-xl shadow-2xl shadow-black/40 animate-in fade-in duration-150"
        >
          <div ref={listRef} className="max-h-64 overflow-y-auto py-1">
            {options.map((option) => (
              <button
                key={option.value}
                ref={(el) => { if (el) optionRefs.current.set(option.value, el); }}
                type="button"
                role="option"
                aria-selected={value === option.value}
                tabIndex={activeOption === option.value ? 0 : -1}
                onMouseEnter={() => setActiveOption(option.value)}
                onFocus={() => setActiveOption(option.value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    moveActiveOption(e.key === 'ArrowDown' ? 1 : -1);
                  } else if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectOption(option.value);
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }
                }}
                onClick={() => selectOption(option.value)}
                className={`
                  w-full flex items-center gap-2.5 px-3.5 py-3 text-left transition-all duration-150
                  ${value === option.value
                    ? 'bg-primary/15 text-primary'
                    : activeOption === option.value
                      ? 'bg-primary/10 text-cream-contrast'
                      : 'text-cream-contrast hover:bg-primary/10 hover:text-cream-contrast'
                  }
                `}
              >
                {option.icon && <span className="text-base flex-shrink-0">{option.icon}</span>}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{option.label}</p>
                  {option.sublabel && <p className="text-xs text-on-surface-variant truncate">{option.sublabel}</p>}
                </div>
                {value === option.value && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

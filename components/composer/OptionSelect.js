"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

const OPTION_HEIGHT = 36;
const MENU_PADDING = 8;
const MIN_MENU_WIDTH = 150;
const VIEWPORT_GAP = 8;

/**
 * Select-only combobox (ARIA APG): focus stays on the button, the highlighted option is
 * exposed through aria-activedescendant. The listbox uses fixed coordinates so the scrolling composer
 * panel can't clip it.
 *
 * options: [{ value, label, display? }]; `display` is the shorter text shown on the button.
 */
export default function OptionSelect({ label, options, value, onChange, className = "" }) {
  const id = useId();
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState(null);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );
  const selected = options[selectedIndex];
  const optionId = (index) => `${id}-option-${index}`;

  const openMenu = useCallback(() => {
    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = options.length * OPTION_HEIGHT + MENU_PADDING;
    const width = Math.max(rect.width, MIN_MENU_WIDTH);
    const above = window.innerHeight - rect.bottom < menuHeight + VIEWPORT_GAP && rect.top > menuHeight;
    setPosition({
      left: Math.max(VIEWPORT_GAP, Math.min(rect.left, window.innerWidth - width - VIEWPORT_GAP)),
      width,
      ...(above ? { bottom: window.innerHeight - rect.top + 4 } : { top: rect.bottom + 4 }),
    });
    setActiveIndex(selectedIndex);
    setOpen(true);
  }, [options.length, selectedIndex]);

  const closeMenu = useCallback(() => setOpen(false), []);

  const select = (index) => {
    onChange(options[index].value);
    closeMenu();
    triggerRef.current?.focus();
  };

  // Outside click, scrolling and resizing all dismiss the menu.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event) => {
      if (!triggerRef.current?.contains(event.target) && !listRef.current?.contains(event.target)) closeMenu();
    };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", closeMenu);
    window.addEventListener("scroll", closeMenu, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, [open, closeMenu]);

  const handleKeyDown = (event) => {
    if (event.ctrlKey || event.metaKey) return; // leave Ctrl/Cmd+Enter to the global "generate" shortcut
    const last = options.length - 1;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openMenu();
      }
      return;
    }
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, last));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(last);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        select(activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        closeMenu();
        break;
      case "Tab":
        closeMenu();
        break;
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-label={label}
        title={selected.label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        aria-activedescendant={open ? optionId(activeIndex) : undefined}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={handleKeyDown}
        className={`flex min-w-0 items-center justify-between gap-0.5 rounded-chip border border-line bg-surface px-2 py-1.5 text-xs text-ink transition-colors duration-150 hover:bg-accent-soft ${className}`}
      >
        <span className="truncate">{selected.display ?? selected.label}</span>
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`shrink-0 text-ink-muted transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul
          ref={listRef}
          id={`${id}-listbox`}
          role="listbox"
          aria-label={label}
          style={position}
          className="fixed z-50 animate-toast-in rounded-chip border border-line bg-surface p-1 shadow-lg"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={optionId(index)}
              role="option"
              aria-selected={option.value === value}
              onClick={() => select(index)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-[6px] px-2.5 text-13 text-ink ${
                index === activeIndex ? "bg-accent-soft" : ""
              }`}
              style={{ height: OPTION_HEIGHT }}
            >
              {option.label}
              {option.value === value && <Check size={14} aria-hidden="true" className="shrink-0 text-accent" />}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

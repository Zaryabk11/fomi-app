"use client";

import { useRef } from "react";
import { MODES } from "@/lib/constants";

// Radio group with a roving tabindex: Tab lands on the selected option, arrow keys move and select.
export default function ModeToggle({ value, onChange }) {
  const refs = useRef([]);
  const index = MODES.findIndex((mode) => mode.id === value);

  const handleKeyDown = (event, current) => {
    const last = MODES.length - 1;
    const target = {
      ArrowRight: current === last ? 0 : current + 1,
      ArrowDown: current === last ? 0 : current + 1,
      ArrowLeft: current === 0 ? last : current - 1,
      ArrowUp: current === 0 ? last : current - 1,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    refs.current[target]?.focus();
    onChange(MODES[target].id);
  };

  return (
    <div
      role="radiogroup"
      aria-label="Generation type"
      className="relative grid grid-cols-2 rounded-full border border-line bg-surface p-1"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-accent-soft transition-transform duration-250 ease-out"
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      {MODES.map((mode, i) => (
        <button
          key={mode.id}
          ref={(el) => (refs.current[i] = el)}
          type="button"
          role="radio"
          aria-checked={value === mode.id}
          tabIndex={value === mode.id ? 0 : -1}
          onClick={() => onChange(mode.id)}
          onKeyDown={(event) => handleKeyDown(event, i)}
          className={`relative z-10 rounded-full py-1.5 text-xs font-medium transition-colors duration-150 ${
            value === mode.id ? "text-ink" : "text-ink-muted"
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}

"use client";

import { useRef } from "react";
import Image from "next/image";
import { Ban, Check } from "lucide-react";
import { STYLES } from "@/lib/constants";

// Radio group with a roving tabindex: Tab enters on the selected style, arrow keys move and select.
export default function StylePicker({ value, onChange }) {
  const refs = useRef([]);
  const selectedIndex = STYLES.findIndex((style) => style.id === value);

  const handleKeyDown = (event, index) => {
    const last = STYLES.length - 1;
    const target = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowDown: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      ArrowUp: index === 0 ? last : index - 1,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    refs.current[target]?.focus();
    onChange(STYLES[target].id);
  };

  return (
    <div role="radiogroup" aria-label="Style" className="grid grid-cols-3 gap-2">
      {STYLES.map((style, index) => {
        const active = style.id === value;
        return (
          <button
            key={style.id}
            ref={(el) => (refs.current[index] = el)}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={index === (selectedIndex === -1 ? 0 : selectedIndex) ? 0 : -1}
            onClick={() => onChange(style.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className="group flex flex-col items-center gap-1 rounded-chip p-1 text-xs text-ink"
          >
            <span
              className={`relative grid aspect-square w-full place-items-center overflow-hidden rounded-chip bg-bg ring-2 transition-shadow duration-150 ${
                active ? "ring-focus" : "ring-transparent group-hover:ring-accent-soft"
              }`}
            >
              {style.src ? (
                <Image src={style.src} alt="" fill sizes="64px" className="object-cover" />
              ) : (
                <Ban size={18} aria-hidden="true" className="text-ink-muted" />
              )}
              {active && (
                <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-accent text-on-accent">
                  <Check size={10} strokeWidth={3} aria-hidden="true" />
                </span>
              )}
            </span>
            <span className={active ? "font-semibold" : ""}>{style.id}</span>
          </button>
        );
      })}
    </div>
  );
}

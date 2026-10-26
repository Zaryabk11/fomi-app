"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="rounded-full bg-surface data-[open=true]:rounded-panel" data-open={open}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((prev) => !prev)}
          className="relative flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium text-ink"
        >
          {title}
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`absolute right-4 text-ink-muted transition-transform duration-250 ease-out ${open ? "rotate-180" : ""}`}
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-label={title}
        className={`grid transition-[grid-template-rows] duration-250 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="p-4 pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

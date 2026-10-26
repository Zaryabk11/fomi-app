"use client";

import { useState } from "react";

// CSS-driven tooltip: shows on hover and on keyboard focus of the wrapped control.
// WCAG 1.4.13: Esc dismisses it without moving focus (it comes back on the next hover or focus).
const SIDES = {
  bottom: "top-full mt-2",
  top: "bottom-full mb-2",
};

// align="end" anchors the tooltip's right edge to the control, so one near the screen edge can't overflow it.
const ALIGNS = {
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
};

export default function Tooltip({ label, side = "bottom", align = "center", children }) {
  const [dismissed, setDismissed] = useState(false);
  const reset = () => setDismissed(false);

  return (
    <span
      className="group/tip relative inline-flex"
      onKeyDown={(event) => event.key === "Escape" && setDismissed(true)}
      onPointerEnter={reset}
      onFocus={reset}
    >
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-chip bg-ink px-2 py-1 text-xs text-bg opacity-0 transition-opacity duration-150 ${
          dismissed ? "" : "group-focus-within/tip:opacity-100 group-hover/tip:opacity-100"
        } ${ALIGNS[align]} ${SIDES[side]}`}
      >
        {label}
      </span>
    </span>
  );
}

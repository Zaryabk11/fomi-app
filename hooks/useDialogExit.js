"use client";

import { useCallback, useRef, useState } from "react";

const EXIT_MS = 200;

/**
 * Lets a dialog play its exit animation (ease-in, 200ms) before it unmounts.
 * Returns `closing` (apply the exit class while true) and `requestClose` (use it for every way of closing).
 */
export default function useDialogExit(onClose) {
  const [closing, setClosing] = useState(false);
  const started = useRef(false);

  const requestClose = useCallback(() => {
    if (started.current) return;
    started.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClose();
      return;
    }
    setClosing(true);
    setTimeout(onClose, EXIT_MS);
  }, [onClose]);

  return { closing, requestClose };
}

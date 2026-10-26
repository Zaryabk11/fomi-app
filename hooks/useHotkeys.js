"use client";

import { useEffect, useRef } from "react";

const isEditable = (el) => el instanceof HTMLElement && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

/**
 * Global keyboard shortcuts. bindings: [{ key, mod?, handler, allowInEditable? }]
 * `mod` means Ctrl or Cmd. Plain keys (like "/") are ignored while typing in a field.
 */
export default function useHotkeys(bindings) {
  const latest = useRef(bindings);
  useEffect(() => {
    latest.current = bindings;
  });

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.altKey || event.isComposing) return;
      const binding = latest.current.find(
        (b) => b.key === event.key && Boolean(b.mod) === (event.metaKey || event.ctrlKey) && (b.allowInEditable || !isEditable(event.target))
      );
      if (!binding) return;
      event.preventDefault();
      binding.handler(event);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}

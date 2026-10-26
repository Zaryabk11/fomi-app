"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Toast from "@/components/ui/Toast";

const DEFAULT_DURATION = 4000;
const ACTION_DURATION = 7000;

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const region = useRef(null);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // toast("Prompt copied") or toast("Failed", { variant: "error", action: { label, onClick } })
  const toast = useCallback(
    (message, { variant = "success", action } = {}) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev.slice(-2), { id, message, variant, action }]);
      timers.current.set(id, setTimeout(() => dismiss(id), action ? ACTION_DURATION : DEFAULT_DURATION));
    },
    [dismiss]
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  // The region is a popover so it lives in the top layer; re-showing it lifts it above an open modal dialog (the lightbox).
  useEffect(() => {
    const el = region.current;
    if (!el?.showPopover) return;
    if (!el.matches(":popover-open")) el.showPopover();
    else if (toasts.length && document.querySelector("dialog[open]")) {
      el.hidePopover();
      el.showPopover();
    }
  }, [toasts]);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* The live region stays mounted so screen readers announce toasts as they are added. */}
      <div
        ref={region}
        popover="manual"
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-[calc(8.5rem+env(safe-area-inset-bottom))] md:bottom-[max(1rem,env(safe-area-inset-bottom))] top-auto z-50 m-0 flex h-auto w-auto flex-col items-center gap-2 overflow-visible border-0 bg-transparent p-0"
      >
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.toast;
}

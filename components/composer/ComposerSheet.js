"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import IconButton from "@/components/ui/IconButton";
import useDialogExit from "@/hooks/useDialogExit";
import ComposerFields from "./ComposerFields";

// Mobile bottom sheet: a modal <dialog> anchored to the bottom edge (focus trap and Esc come from the browser).
export default function ComposerSheet({ onClose }) {
  const dialogRef = useRef(null);
  const { closing, requestClose } = useDialogExit(onClose);

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement;
    dialog.showModal();
    // Land in the prompt so the keyboard is ready, like a messaging composer.
    dialog.querySelector("[data-prompt-input]")?.focus();
    return () => {
      dialog.close();
      opener?.focus?.();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Create"
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => event.target === event.currentTarget && requestClose()}
      className={`m-0 mt-auto max-h-[92dvh] w-full max-w-none ${closing ? "animate-sheet-out" : "animate-sheet-in"} overflow-hidden rounded-b-none rounded-t-panel border-0 bg-panel p-0 text-ink shadow-2xl backdrop:bg-black/50`}
    >
      <div className="flex max-h-[92dvh] flex-col">
        <div className="relative flex justify-center px-4 pb-1 pt-3">
          <span aria-hidden="true" className="h-1 w-10 rounded-full bg-line" />
          {/* The positioned wrapper is the outermost element: IconButton wraps its button in a relative tooltip span. */}
          <div className="absolute right-3 top-2">
            <IconButton label="Close" icon={X} size={32} tooltipAlign="end" onClick={requestClose} />
          </div>
        </div>
        <div className="overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          <ComposerFields onSubmitted={requestClose} />
        </div>
      </div>
    </dialog>
  );
}

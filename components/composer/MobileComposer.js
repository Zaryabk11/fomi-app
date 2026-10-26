"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useComposer } from "@/context/GenerationContext";
import useGenerate from "@/hooks/useGenerate";
import { OPEN_COMPOSER_EVENT } from "@/lib/media";
import { TAB_BAR_HEIGHT } from "@/components/layout/MobileTabBar";
import GenerateButton from "./GenerateButton";

// The sheet holds every control, so it only loads when first opened.
const ComposerSheet = dynamic(() => import("./ComposerSheet"), { ssr: false });

// Below md: a compact input docked above the tab bar. Tapping it opens the full composer as a bottom sheet.
export default function MobileComposer() {
  const { prompt } = useComposer();
  const { generate, loading } = useGenerate();
  const [open, setOpen] = useState(false);

  // "Reuse prompt" asks for the composer from elsewhere in the app.
  useEffect(() => {
    const openSheet = () => setOpen(true);
    window.addEventListener(OPEN_COMPOSER_EVENT, openSheet);
    return () => window.removeEventListener(OPEN_COMPOSER_EVENT, openSheet);
  }, []);

  return (
    <>
      <form
        aria-label="Quick create"
        onSubmit={(event) => {
          event.preventDefault();
          generate();
        }}
        style={{ bottom: `calc(${TAB_BAR_HEIGHT + 1}px + env(safe-area-inset-bottom))` }}
        className="fixed inset-x-0 z-30 flex items-center gap-2 border-t border-line bg-bg px-3 py-2 md:hidden"
      >
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
          className="min-w-0 flex-1 truncate rounded-full border-2 border-ink bg-surface px-4 py-2 text-left text-13"
        >
          {prompt ? <span className="text-ink">{prompt}</span> : <span className="text-ink-muted">Describe your imagination…</span>}
        </button>
        <GenerateButton disabled={!prompt.trim()} loading={loading} />
      </form>
      {open && <ComposerSheet onClose={() => setOpen(false)} />}
    </>
  );
}

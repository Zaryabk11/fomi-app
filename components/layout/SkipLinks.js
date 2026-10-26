"use client";

import { usePathname } from "next/navigation";
import { focusPrompt } from "@/lib/media";

const LINK =
  "fixed left-4 top-4 z-[60] -translate-y-24 rounded-full bg-ink px-4 py-2 text-13 font-medium text-bg focus:translate-y-0";

// First tab stops: lets keyboard users jump past the header and the history strip.
export default function SkipLinks() {
  const home = usePathname() === "/";

  return (
    <div>
      {home && (
        <button type="button" onClick={focusPrompt} className={LINK}>
          Skip to prompt
        </button>
      )}
      <a href={home ? "#feed" : "#main-content"} className={`${LINK} ${home ? "left-44" : ""}`}>
        {home ? "Skip to results" : "Skip to content"}
      </a>
    </div>
  );
}

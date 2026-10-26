"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import IconButton from "@/components/ui/IconButton";
import ComposerFields from "./ComposerFields";

// Desktop: the fixed left panel. Tablet (md to lg): a collapsible panel above the feed. Below md the
// MobileComposer takes over, so this panel is hidden.
export default function Composer() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      aria-label="Create"
      className="boot animate-fade-in [animation-delay:80ms] hidden shrink-0 gap-2 rounded-panel bg-panel p-4 md:flex md:flex-row md:items-start lg:w-[300px] lg:flex-col lg:overflow-y-auto lg:gap-3 3xl:w-[340px]"
    >
      <h2 className="sr-only">Create</h2>
      <ComposerFields collapsed={!expanded} />
      <div className="lg:hidden">
        <IconButton
          label={expanded ? "Collapse composer" : "Expand composer"}
          icon={ChevronDown}
          size={32}
          tooltipAlign="end"
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
          className={`transition-transform duration-250 ${expanded ? "rotate-180" : ""}`}
        />
      </div>
    </aside>
  );
}

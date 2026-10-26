"use client";

import { useState } from "react";
import { Copy, RotateCcw, Trash2 } from "lucide-react";
import IconButton from "@/components/ui/IconButton";
import usePromptActions from "@/hooks/usePromptActions";

const CLAMP_THRESHOLD = 400;

const formatTime = (iso) =>
  new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(new Date(iso));

export default function PromptCard({ generation }) {
  const [expanded, setExpanded] = useState(false);
  const { copy, reuse, remove } = usePromptActions(generation);
  const long = generation.prompt.length > CLAMP_THRESHOLD;

  return (
    <article className="group relative flex flex-col gap-3 rounded-panel bg-panel p-4">
      <p className={`text-13 text-ink ${long && !expanded ? "line-clamp-[10]" : ""}`}>{generation.prompt}</p>
      {long && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
          className="w-fit text-xs font-medium text-ink underline underline-offset-2"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        {/* Actions appear on hover or keyboard focus; touch users get them always (no hover there). */}
        {!generation.pending && (
          <div className="flex gap-1 opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
            <IconButton label="Copy prompt" icon={Copy} tooltipSide="top" onClick={copy} />
            <IconButton label="Reuse prompt" icon={RotateCcw} tooltipSide="top" onClick={reuse} />
            <IconButton label="Delete generation" icon={Trash2} tooltipSide="top" onClick={remove} />
          </div>
        )}
        <div className="ml-auto flex flex-wrap items-center justify-end gap-x-2 gap-y-1">
          <span className="text-xs text-ink-muted">
            {generation.ratio} · <time dateTime={generation.createdAt}>{formatTime(generation.createdAt)} UTC</time>
          </span>
          <span className="rounded-chip bg-surface px-2.5 py-1 text-xs font-medium text-ink shadow-sm">{generation.model}</span>
        </div>
      </div>
    </article>
  );
}

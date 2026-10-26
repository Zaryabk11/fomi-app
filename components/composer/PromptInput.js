"use client";

import { useId, useLayoutEffect, useRef } from "react";
import { PROMPT_MAX_LENGTH } from "@/lib/constants";
import GenerateButton from "./GenerateButton";

const COUNTER_THRESHOLD = 0.8;

// `collapsed` is the tablet one-line form (prompt and Generate side by side); from lg up it is always the full card.
export default function PromptInput({ value, onChange, loading, collapsed = false }) {
  const id = useId();
  const textarea = useRef(null);
  const showCount = value.length >= PROMPT_MAX_LENGTH * COUNTER_THRESHOLD;

  // Auto-grow on every value change (typing, "Reuse prompt", clearing): reset to auto so it can shrink too.
  useLayoutEffect(() => {
    const el = textarea.current;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value, collapsed]);

  return (
    <div
      className={`flex rounded-panel border-2 border-ink bg-surface focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-panel ${
        collapsed ? "flex-row items-center gap-2 p-2 pl-3 lg:flex-col lg:items-stretch lg:gap-0 lg:p-3" : "flex-col p-3"
      }`}
    >
      <label htmlFor={id} className="sr-only">
        Prompt
      </label>
      <textarea
        ref={textarea}
        id={id}
        data-prompt-input=""
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }
        }}
        maxLength={PROMPT_MAX_LENGTH}
        rows={collapsed ? 1 : 4}
        placeholder="Describe your imagination…"
        className={`w-full resize-none bg-transparent text-13 text-ink outline-none placeholder:text-ink-muted ${
          collapsed ? "max-h-24 min-h-6 lg:max-h-60 lg:min-h-[96px]" : "max-h-60 min-h-[96px]"
        }`}
      />
      <div className={`flex shrink-0 items-center justify-end gap-3 ${collapsed ? "lg:mt-2" : "mt-2"}`}>
        {showCount && (
          <span className="text-xs text-ink-muted" aria-live="polite">
            {value.length}/{PROMPT_MAX_LENGTH}
          </span>
        )}
        <GenerateButton disabled={!value.trim()} loading={loading} />
      </div>
    </div>
  );
}

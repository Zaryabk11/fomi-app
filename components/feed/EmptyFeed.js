"use client";

import { Sparkles } from "lucide-react";
import { useComposer, useGenerationDispatch } from "@/context/GenerationContext";
import { EXAMPLE_PROMPTS } from "@/lib/constants";
import { focusPrompt } from "@/lib/media";

// Shown when there are no generations: a short invitation plus three prompts that fill the composer.
export default function EmptyFeed() {
  const { mode } = useComposer();
  const dispatch = useGenerationDispatch();

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-2 py-10 text-center md:py-16">
      <span aria-hidden="true" className="grid size-16 place-items-center rounded-full bg-panel text-ink">
        <Sparkles size={28} strokeWidth={1.5} />
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold">Nothing created yet</h3>
        <p className="text-13 text-ink-muted">Describe what you want to see, or start from one of these.</p>
      </div>
      <ul className="flex w-full flex-col gap-2">
        {EXAMPLE_PROMPTS[mode].map((prompt) => (
          <li key={prompt}>
            <button
              type="button"
              onClick={() => {
                dispatch({ type: "SET_PROMPT", prompt });
                focusPrompt();
              }}
              className="w-full rounded-panel border border-line bg-surface px-4 py-3 text-left text-13 text-ink transition-colors duration-150 hover:bg-accent-soft"
            >
              {prompt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

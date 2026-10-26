"use client";

import { useCallback, useMemo } from "react";
import { useComposer, useGenerationDispatch } from "@/context/GenerationContext";
import useGenerate from "@/hooks/useGenerate";
import { COUNTS, DURATIONS, MODELS, RATIOS } from "@/lib/constants";
import Accordion from "./Accordion";
import AdvancedSettings from "./AdvancedSettings";
import ModeToggle from "./ModeToggle";
import OptionSelect from "./OptionSelect";
import PromptInput from "./PromptInput";
import StylePicker from "./StylePicker";

const COUNT_OPTIONS = COUNTS.map((n) => ({
  value: n,
  label: `${n} ${n === 1 ? "image" : "images"}`,
  display: `# ${n} ${n === 1 ? "Image" : "Images"}`,
}));
const DURATION_OPTIONS = DURATIONS.map((s) => ({ value: s, label: `${s} seconds`, display: `${s}s` }));
const RATIO_OPTIONS = RATIOS.map((r) => ({ value: r, label: r }));
const MODEL_OPTIONS = MODELS.map((m) => ({ value: m, label: m }));

/**
 * Every composer control, shared by the desktop/tablet panel and the mobile bottom sheet.
 * `collapsed` is the tablet one-line state: everything but the prompt row is hidden until lg.
 */
export default function ComposerFields({ collapsed = false, onSubmitted }) {
  const { mode, prompt, settings } = useComposer();
  const dispatch = useGenerationDispatch();
  const { generate, loading } = useGenerate();

  const setMode = useCallback((next) => dispatch({ type: "SET_MODE", mode: next }), [dispatch]);
  const setPrompt = useCallback((next) => dispatch({ type: "SET_PROMPT", prompt: next }), [dispatch]);
  const update = useCallback((patch) => dispatch({ type: "UPDATE_SETTINGS", settings: patch }), [dispatch]);

  const handlers = useMemo(
    () => ({
      count: (count) => update({ count }),
      duration: (duration) => update({ duration }),
      ratio: (ratio) => update({ ratio }),
      model: (model) => update({ model }),
      style: (style) => update({ style }),
      advanced: (advanced) => update({ advanced }),
    }),
    [update]
  );

  const extra = collapsed ? "hidden lg:flex" : "flex";

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <div className={collapsed ? "hidden lg:block" : ""}>
        <ModeToggle value={mode} onChange={setMode} />
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!prompt.trim()) return;
          generate();
          onSubmitted?.();
        }}
        className="flex flex-col gap-3"
      >
        <PromptInput value={prompt} onChange={setPrompt} loading={loading} collapsed={collapsed} />
        <div className={`grid-cols-[auto_auto_1fr] gap-1.5 ${collapsed ? "hidden lg:grid" : "grid"}`}>
          {mode === "video" ? (
            <OptionSelect label="Duration" options={DURATION_OPTIONS} value={settings.duration} onChange={handlers.duration} />
          ) : (
            <OptionSelect label="Number of images" options={COUNT_OPTIONS} value={settings.count} onChange={handlers.count} />
          )}
          <OptionSelect label="Aspect ratio" options={RATIO_OPTIONS} value={settings.ratio} onChange={handlers.ratio} />
          <OptionSelect label="Model" options={MODEL_OPTIONS} value={settings.model} onChange={handlers.model} />
        </div>
      </form>
      <div className={`${extra} flex-col gap-3`}>
        <Accordion title="Advanced">
          <AdvancedSettings value={settings.advanced} onChange={handlers.advanced} />
        </Accordion>
        <Accordion title="Styles">
          <StylePicker value={settings.style} onChange={handlers.style} />
        </Accordion>
      </div>
    </div>
  );
}

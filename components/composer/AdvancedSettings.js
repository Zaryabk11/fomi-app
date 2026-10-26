"use client";

import { useId } from "react";
import { Dices } from "lucide-react";
import IconButton from "@/components/ui/IconButton";
import { SEED_MAX } from "@/lib/constants";

const FIELD =
  "w-full rounded-chip border border-line bg-bg px-3 py-2 text-13 text-ink outline-none placeholder:text-ink-muted focus-visible:ring-2 focus-visible:ring-focus";
const LABEL = "mb-1 block text-xs font-medium text-ink-muted";

export default function AdvancedSettings({ value, onChange }) {
  const id = useId();
  const update = (patch) => onChange({ ...value, ...patch });

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label htmlFor={`${id}-seed`} className={LABEL}>
          Seed
        </label>
        <div className="flex gap-2">
          <input
            id={`${id}-seed`}
            type="text"
            inputMode="numeric"
            placeholder="Random"
            value={value.seed}
            onChange={(event) => update({ seed: event.target.value.replace(/\D/g, "").slice(0, 9) })}
            className={FIELD}
          />
          <IconButton
            label="Randomize seed"
            icon={Dices}
            size={36}
            tooltipSide="top"
            tooltipAlign="end"
            onClick={() => update({ seed: String(Math.floor(Math.random() * SEED_MAX)) })}
            className="rounded-chip border border-line bg-bg"
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-guidance`} className={`${LABEL} flex justify-between`}>
          Guidance
          <output htmlFor={`${id}-guidance`} className="text-ink">
            {value.guidance}
          </output>
        </label>
        <input
          id={`${id}-guidance`}
          type="range"
          min={1}
          max={20}
          step={0.5}
          value={value.guidance}
          onChange={(event) => update({ guidance: Number(event.target.value) })}
          className="w-full accent-accent"
        />
      </div>

      <div>
        <label htmlFor={`${id}-negative`} className={LABEL}>
          Negative prompt
        </label>
        <textarea
          id={`${id}-negative`}
          rows={2}
          placeholder="What to avoid, e.g. blurry, extra fingers"
          value={value.negativePrompt}
          onChange={(event) => update({ negativePrompt: event.target.value })}
          className={`${FIELD} resize-none`}
        />
      </div>
    </div>
  );
}

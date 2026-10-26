"use client";

import { useCallback, useEffect, useRef } from "react";
import { useComposer, useFeed, useGenerationDispatch } from "@/context/GenerationContext";
import { useToast } from "@/context/ToastContext";
import { postGenerate } from "@/lib/api";

// Shared by every useGenerate instance (desktop panel, mobile bar, hotkey) so none of them can start a second request.
let inFlight = false;

// Runs one generation: pending group in, then success (new group) or error (toast with Retry).
export default function useGenerate() {
  const { mode, prompt, settings } = useComposer();
  const { pending } = useFeed();
  const dispatch = useGenerationDispatch();
  const toast = useToast();

  const latestGenerate = useRef(null);

  const generate = useCallback(async () => {
    const text = prompt.trim();
    // State updates are async, so this flag (not the pending state) is what blocks a same-tick double submit.
    if (!text || inFlight) return;
    inFlight = true;

    const count = mode === "video" ? 1 : settings.count;
    const { ratio, model, style, advanced, duration } = settings;
    const clientId = `pending_${Date.now()}`;

    dispatch({
      type: "GENERATE_START",
      pending: { id: clientId, pending: true, prompt: text, mode, model, ratio, style, count, createdAt: new Date().toISOString() },
    });

    try {
      const generation = await postGenerate({ prompt: text, mode, count, ratio, model, style, duration, seed: advanced.seed || undefined });
      // clientId keeps the feed item's React key stable from skeleton to result; fresh drives the entrance animations.
      dispatch({ type: "GENERATE_SUCCESS", generation: { ...generation, clientId, fresh: true } });
    } catch (error) {
      dispatch({ type: "GENERATE_ERROR", error: error.message });
      toast(error.message, { variant: "error", action: { label: "Retry", onClick: () => latestGenerate.current?.() } });
    } finally {
      inFlight = false;
    }
  }, [prompt, mode, settings, dispatch, toast]);

  useEffect(() => {
    latestGenerate.current = generate;
  }, [generate]);

  return { generate, loading: Boolean(pending) };
}

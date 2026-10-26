"use client";

import { useCallback } from "react";
import { useGenerationDispatch } from "@/context/GenerationContext";
import { useToast } from "@/context/ToastContext";
import { focusPrompt } from "@/lib/media";

// Copy / reuse / delete for one generation's prompt, shared by PromptCard and Lightbox.
export default function usePromptActions(generation) {
  const dispatch = useGenerationDispatch();
  const toast = useToast();

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generation.prompt);
      toast("Prompt copied");
    } catch {
      toast("Couldn't copy the prompt", { variant: "error" });
    }
  }, [generation.prompt, toast]);

  const reuse = useCallback(() => {
    dispatch({ type: "REUSE_PROMPT", generation });
    focusPrompt();
    toast("Prompt loaded into the composer");
  }, [dispatch, generation, toast]);

  const remove = useCallback(() => {
    dispatch({ type: "DELETE_GENERATION", id: generation.id });
    document.getElementById("feed")?.focus({ preventScroll: true });
    toast("Generation deleted");
  }, [dispatch, generation.id, toast]);

  return { copy, reuse, remove };
}

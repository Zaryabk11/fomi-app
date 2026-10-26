"use client";

import { useCallback } from "react";
import { useGenerationDispatch } from "@/context/GenerationContext";
import { useToast } from "@/context/ToastContext";
import { downloadFile } from "@/lib/media";

// Download / favorite / upscale for one media item, shared by tile overlay and lightbox.
export default function useMediaActions(generationId, item) {
  const dispatch = useGenerationDispatch();
  const toast = useToast();
  const { id, src, type } = item;

  const download = useCallback(async () => {
    const extension = src.split("?")[0].split(".").pop() || (type === "video" ? "mp4" : "jpg");
    const saved = await downloadFile(src, `fomi-${id}.${extension}`);
    toast(saved ? "Downloaded" : "Opened in a new tab to save");
  }, [id, src, type, toast]);

  const toggleFavorite = useCallback(
    () => dispatch({ type: "TOGGLE_FAVORITE", generationId, itemId: id }),
    [dispatch, generationId, id]
  );

  const upscale = useCallback(() => toast("Upscale queued"), [toast]);

  return { download, toggleFavorite, upscale };
}

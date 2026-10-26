"use client";

import useGenerate from "@/hooks/useGenerate";
import useHotkeys from "@/hooks/useHotkeys";
import { focusPrompt } from "@/lib/media";

// Mounted once. Esc needs no binding here: dialogs, the sheet and every popover close themselves on Esc.
export default function Hotkeys() {
  const { generate } = useGenerate();
  const modalOpen = () => Boolean(document.querySelector("dialog[open]"));

  useHotkeys([
    // "/" jumps to the prompt, like search boxes elsewhere.
    { key: "/", handler: () => !modalOpen() && focusPrompt() },
    // Ctrl/Cmd+Enter generates from anywhere. Inside the prompt the textarea handles it itself.
    {
      key: "Enter",
      mod: true,
      allowInEditable: true,
      handler: (event) => !modalOpen() && !event.target.hasAttribute?.("data-prompt-input") && generate(),
    },
  ]);

  return null;
}

"use client";

import { useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { useComposer, useGenerationDispatch } from "@/context/GenerationContext";
import { MODES, NAV_ITEMS } from "@/lib/constants";

const MODE_IDS = MODES.map((m) => m.id);

// Shared by the header nav and the mobile tab bar. On "/" the active item is the composer mode (Image or Video,
// shared with ModeToggle); on a placeholder route it is that section.
export default function usePrimaryNav() {
  const { mode } = useComposer();
  const dispatch = useGenerationDispatch();
  const pathname = usePathname();
  const refs = useRef([]);

  const section = NAV_ITEMS.find((item) => item.href !== "/" && item.href === pathname);
  const activeId = section ? section.id : mode;

  // Image and Video are links to "/" that also pick the mode.
  const select = useCallback(
    (id) => MODE_IDS.includes(id) && dispatch({ type: "SET_MODE", mode: id }),
    [dispatch]
  );

  const handleKeyDown = useCallback((event, index) => {
    const last = NAV_ITEMS.length - 1;
    const target = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    refs.current[target]?.focus();
  }, []);

  return {
    activeId,
    activeIndex: NAV_ITEMS.findIndex((item) => item.id === activeId),
    refs,
    select,
    handleKeyDown,
  };
}

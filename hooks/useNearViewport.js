"use client";

import { useEffect, useState } from "react";

/**
 * True once the element is within `margin` px of the visible area (and stays true). Lets below-the-fold tiles
 * skip their image request until the user scrolls close, instead of relying on the browser's much wider
 * native lazy-loading distance, which on a short mobile page fetches the whole feed up front.
 */
export default function useNearViewport(ref, { enabled = true, margin = 400 } = {}) {
  const [near, setNear] = useState(!enabled);

  useEffect(() => {
    if (near) return;
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setNear(true);
      return;
    }
    // From lg up the feed is its own scroll container; the page scrolls itself below that.
    const feed = document.getElementById("feed");
    const root = feed && getComputedStyle(feed).overflowY === "auto" ? feed : null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { root, rootMargin: `${margin}px 0px` }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [near, ref, margin]);

  return near;
}

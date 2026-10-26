"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import IconButton from "@/components/ui/IconButton";
import { useFeed } from "@/context/GenerationContext";
import { useToast } from "@/context/ToastContext";
import { smoothBehavior } from "@/lib/media";
import HistoryThumb from "./HistoryThumb";

// The positioned wrapper must be the arrow's outermost element, or the tooltip span around the button stays in flow.
const ARROW_WRAP = "absolute top-1/2 z-10 hidden -translate-y-1/2 md:block";
const ARROW = "border border-line bg-surface shadow-md";

export default function HistoryStrip() {
  const { generations } = useFeed();
  const toast = useToast();
  const headingId = useId();
  const list = useRef(null);
  const [edges, setEdges] = useState({ start: false, end: false }); // is there more to scroll to on that side?
  const [tabStop, setTabStop] = useState(0); // roving tabindex: the one thumbnail reachable with Tab

  // One thumbnail per generated image, newest first, each remembering its group.
  const thumbs = useMemo(
    () => generations.flatMap((g) => g.items.map((item) => ({ ...item, groupId: g.id, fresh: g.fresh }))),
    [generations]
  );

  const measure = useCallback(() => {
    const el = list.current;
    if (!el) return;
    const start = el.scrollLeft > 1;
    const end = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, []);

  // Re-measure on scroll, on resize, and when thumbnails are added.
  useEffect(() => {
    const el = list.current;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    const frame = requestAnimationFrame(measure);
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", measure);
      cancelAnimationFrame(frame);
    };
  }, [measure, thumbs.length]);

  const scrollByPage = (direction) =>
    list.current.scrollBy({ left: direction * list.current.clientWidth * 0.8, behavior: smoothBehavior() });

  const handleKeyDown = (event) => {
    const buttons = [...list.current.querySelectorAll("button")];
    const index = buttons.indexOf(document.activeElement);
    const target = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: buttons.length - 1 }[event.key];
    if (target === undefined || index === -1) return;
    event.preventDefault();
    buttons[Math.min(Math.max(target, 0), buttons.length - 1)].focus();
  };

  const mask = `linear-gradient(to right, transparent 0, #000 ${edges.start ? 32 : 0}px, #000 calc(100% - ${edges.end ? 48 : 0}px), transparent 100%)`;

  return (
    <section aria-labelledby={headingId} className="mx-4 flex items-center gap-2 rounded-tile bg-surface p-2 shadow-sm md:mx-6 md:gap-3">
      <h2 id={headingId} className="sr-only">
        History
      </h2>
      <button
        type="button"
        onClick={() => toast("The full history page isn't available in this demo")}
        className="group flex h-14 w-20 shrink-0 flex-col items-center justify-center rounded-chip border border-line bg-bg text-center shadow-sm transition-colors duration-150 hover:bg-accent-soft md:h-16 md:w-24"
      >
        <span className="text-sm font-semibold">
          History
        </span>
        <span className="text-xs text-ink-muted transition-colors duration-150 group-hover:text-ink">View all</span>
      </button>
      <div className="h-8 w-px shrink-0 bg-line md:h-10" aria-hidden="true" />
      <div className="relative min-h-14 min-w-0 flex-1 md:min-h-16">
        {edges.start && (
          <div className={`${ARROW_WRAP} left-0`}>
            <IconButton label="Scroll history left" icon={ChevronLeft} onClick={() => scrollByPage(-1)} className={ARROW} />
          </div>
        )}
        <ul
          ref={list}
          onKeyDown={handleKeyDown}
          className={`no-scrollbar snap-x gap-2 overflow-x-auto ${thumbs.length ? "flex" : "hidden"}`}
          style={{ maskImage: mask, WebkitMaskImage: mask }}
        >
          {thumbs.map((item, index) => (
            <li key={item.id} className="shrink-0">
              <HistoryThumb item={item} index={index} tabIndex={index === tabStop ? 0 : -1} onFocus={() => setTabStop(index)} />
            </li>
          ))}
        </ul>
        {thumbs.length === 0 && <p className="px-2 py-4 text-13 text-ink-muted">Everything you create will show up here.</p>}
        {edges.end && (
          <div className={`${ARROW_WRAP} right-0`}>
            <IconButton label="Scroll history right" icon={ChevronRight} tooltipAlign="end" onClick={() => scrollByPage(1)} className={ARROW} />
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Copy, Download, Heart, Sparkles, X } from "lucide-react";
import IconButton from "@/components/ui/IconButton";
import useMediaActions from "@/hooks/useMediaActions";
import useDialogExit from "@/hooks/useDialogExit";
import usePromptActions from "@/hooks/usePromptActions";

const ACTION_BUTTON =
  "inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors duration-150 hover:bg-accent-soft";

// A native modal <dialog>: the browser traps focus, makes the page inert and handles Esc.
export default function Lightbox({ generation, index, onNavigate, onClose }) {
  const dialogRef = useRef(null);
  const item = generation.items[index];
  const total = generation.items.length;
  const isVideo = item.type === "video";
  const { download, toggleFavorite, upscale } = useMediaActions(generation.id, item);
  const { copy } = usePromptActions(generation);
  const { closing, requestClose } = useDialogExit(onClose);

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement;
    dialog.showModal();
    return () => {
      dialog.close();
      opener?.focus?.();
    };
  }, []);

  const go = (next) => next >= 0 && next < total && onNavigate(next);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") go(index - 1);
    if (event.key === "ArrowRight") go(index + 1);
  };

  const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <dialog
      ref={dialogRef}
      aria-label={`${isVideo ? "Video" : "Image"} ${index + 1} of ${total}`}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onKeyDown={handleKeyDown}
      // Only the ::backdrop sits outside the dialog box, so a click that targets the dialog itself is a backdrop click.
      onClick={(event) => event.target === event.currentTarget && requestClose()}
      className={`m-auto max-h-[94dvh] w-[min(1100px,94vw)] ${closing ? "animate-dialog-out" : "animate-dialog-in"} overflow-hidden rounded-panel border-0 bg-surface p-0 text-ink shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm`}
    >
      <div className="grid max-h-[94dvh] overflow-y-auto md:grid-cols-[minmax(0,1fr)_320px] md:overflow-hidden">
        <div className="relative grid min-h-[40dvh] place-items-center bg-panel md:max-h-[94dvh]">
          {isVideo ? (
            <video
              key={item.id}
              src={item.src}
              poster={item.poster}
              controls
              loop
              muted
              playsInline
              autoPlay={!noMotion}
              className="max-h-[70dvh] w-full object-contain md:max-h-[94dvh]"
            />
          ) : (
            <Image
              key={item.id}
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="(min-width: 768px) 70vw, 94vw"
              placeholder="blur"
              blurDataURL={item.blurDataURL}
              priority
              className="h-auto max-h-[70dvh] w-auto max-w-full object-contain md:max-h-[94dvh]"
            />
          )}
          <div className="pointer-events-none absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between">
            {index > 0 ? (
              <IconButton variant="overlay" size={40} label="Previous" icon={ChevronLeft} onClick={() => go(index - 1)} className="pointer-events-auto" />
            ) : (
              <span />
            )}
            {index < total - 1 && (
              <IconButton variant="overlay" size={40} label="Next" icon={ChevronRight} onClick={() => go(index + 1)} className="pointer-events-auto" />
            )}
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-4 p-5 md:max-h-[94dvh] md:overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-muted" aria-live="polite">
              {index + 1} / {total}
            </span>
            <IconButton label="Close" icon={X} onClick={requestClose} autoFocus />
          </div>
          <p className="whitespace-pre-line text-13 text-ink">{generation.prompt}</p>
          <ul aria-label="Details" className="flex flex-wrap gap-2 text-xs">
            {[generation.model, generation.ratio, generation.style].map((value) => (
              <li key={value} className="rounded-chip bg-panel px-2.5 py-1 text-ink">
                {value}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap gap-2">
            <button type="button" onClick={download} className={ACTION_BUTTON}>
              <Download size={14} aria-hidden="true" /> Download
            </button>
            <button type="button" onClick={toggleFavorite} aria-pressed={Boolean(item.favorite)} className={ACTION_BUTTON}>
              <Heart size={14} aria-hidden="true" className={item.favorite ? "fill-accent text-accent" : ""} />
              {item.favorite ? "Favorited" : "Favorite"}
            </button>
            <button type="button" onClick={upscale} className={ACTION_BUTTON}>
              <Sparkles size={14} aria-hidden="true" /> Upscale
            </button>
            <button type="button" onClick={copy} className={ACTION_BUTTON}>
              <Copy size={14} aria-hidden="true" /> Copy prompt
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

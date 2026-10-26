"use client";

import { memo, useRef, useState } from "react";
import Image from "next/image";
import { Download, Expand, Heart, Play, Sparkles } from "lucide-react";
import IconButton from "@/components/ui/IconButton";
import useMediaActions from "@/hooks/useMediaActions";
import useNearViewport from "@/hooks/useNearViewport";
import { formatDuration } from "@/lib/media";

// sizes mirrors the layout: 2 columns on mobile, 3 on tablet, 4 beside the composer on desktop.
const SIZES = "(min-width: 1600px) 240px, (min-width: 1024px) 18vw, (min-width: 768px) 30vw, 46vw";

// Each overlay button re-enables pointer events; the bar itself lets clicks fall through to "open".
const ACTION = "pointer-events-auto";

function MediaTile({ item, generationId, index, onOpen, priority = false }) {
  const isVideo = item.type === "video";
  const { download, toggleFavorite, upscale } = useMediaActions(generationId, item);
  const ref = useRef(null);
  // Above-the-fold tiles (priority) are server-rendered with next/image's own blur placeholder. Every other tile
  // paints the blur as a background and only requests its image once it is near the viewport, then fades it in.
  const fadeIn = item.fresh || !priority;
  const near = useNearViewport(ref, { enabled: !priority && !item.fresh });
  const [loaded, setLoaded] = useState(!fadeIn);
  const [playing, setPlaying] = useState(false);

  // Videos play on hover or keyboard focus only, never for reduced-motion users.
  const startPreview = () => {
    if (isVideo && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(true);
  };
  const stopPreview = () => setPlaying(false);

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-tile bg-panel bg-cover"
      style={{ aspectRatio: `${item.width} / ${item.height}`, backgroundImage: fadeIn ? `url("${item.blurDataURL}")` : undefined }}
      onPointerEnter={(event) => event.pointerType === "mouse" && startPreview()}
      onPointerLeave={stopPreview}
      onFocus={startPreview}
      onBlur={stopPreview}
    >
      {near && (
        <Image
          src={isVideo ? item.poster : item.src}
          alt=""
          fill
          sizes={SIZES}
          quality={60}
          priority={priority}
          placeholder={fadeIn ? "empty" : "blur"}
          blurDataURL={fadeIn ? undefined : item.blurDataURL}
          onLoad={() => setLoaded(true)}
          className={`object-cover transition-opacity duration-300 ease-out ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
      {playing && (
        <video
          src={item.src}
          poster={item.poster}
          // Browsers skip the autoplay attribute when preload="none", so start playback explicitly.
          ref={(el) => el?.play().catch(() => {})}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 size-full object-cover"
        />
      )}

      {/* The whole tile opens the lightbox; the action buttons below sit above it. */}
      <button
        type="button"
        aria-label={`Open ${isVideo ? "video" : "image"}: ${item.alt}`}
        onClick={() => onOpen(generationId, index)}
        className="absolute inset-0 z-10 rounded-tile outline-offset-[-3px]"
      />

      {isVideo && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/55 py-1 pl-1.5 pr-2 text-xs text-white backdrop-blur-sm transition-opacity duration-150 ${playing ? "opacity-0" : ""}`}
        >
          <Play size={12} className="fill-current" />
          {formatDuration(item.duration)}
        </span>
      )}
      {item.favorite && (
        <Heart
          aria-hidden="true"
          size={16}
          className="pointer-events-none absolute right-2 top-2 fill-accent text-accent drop-shadow transition-opacity duration-150 group-focus-within:opacity-0 group-hover:opacity-0"
        />
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center gap-1.5 bg-gradient-to-t from-black/50 to-transparent px-2 pb-2 pt-8 opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100">
        <IconButton variant="overlay" tooltipSide="top" label="Download" icon={Download} onClick={download} className={ACTION} />
        <IconButton
          variant="overlay"
          tooltipSide="top"
          label={item.favorite ? "Remove from favorites" : "Add to favorites"}
          icon={Heart}
          filled={item.favorite}
          pressed={Boolean(item.favorite)}
          onClick={toggleFavorite}
          className={ACTION}
        />
        <IconButton variant="overlay" tooltipSide="top" label="Upscale" icon={Sparkles} onClick={upscale} className={ACTION} />
        <IconButton variant="overlay" tooltipSide="top" label="Open" icon={Expand} onClick={() => onOpen(generationId, index)} className={ACTION} />
      </div>
    </div>
  );
}

export default memo(MediaTile);

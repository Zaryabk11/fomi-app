import Image from "next/image";
import { revealGroup } from "@/lib/media";

// 56px on mobile, 64px from md up.
// index drives the load-time stagger; thumbnails added later (item.fresh) just scale in.
const STAGGER_MS = 35;
const MAX_STAGGERED = 14;

export default function HistoryThumb({ item, index, tabIndex, onFocus }) {
  return (
    <button
      type="button"
      aria-label={`Show generation: ${item.alt}`}
      tabIndex={tabIndex}
      onFocus={onFocus}
      onClick={() => revealGroup(item.groupId)}
      className={`block shrink-0 snap-start rounded-chip transition-transform duration-150 hover:-translate-y-0.5 hover:ring-2 hover:ring-accent ${item.fresh ? "animate-scale-in" : "boot animate-thumb-in"}`}
      style={item.fresh ? undefined : { animationDelay: `${150 + Math.min(index, MAX_STAGGERED) * STAGGER_MS}ms` }}
    >
      <Image
        src={item.type === "video" ? item.poster : item.src}
        alt=""
        width={64}
        height={64}
        sizes="(min-width: 768px) 64px, 56px"
        quality={50}
        placeholder="blur"
        blurDataURL={item.blurDataURL}
        className="block size-14 rounded-chip object-cover md:size-16"
      />
    </button>
  );
}

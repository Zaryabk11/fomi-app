"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useFeed } from "@/context/GenerationContext";
import { smoothBehavior } from "@/lib/media";
import EmptyFeed from "./EmptyFeed";
import GenerationGroup from "./GenerationGroup";
import styles from "./GenerationFeed.module.css";

// The lightbox is only needed once a tile is opened, so keep it out of the initial bundle.
const Lightbox = dynamic(() => import("@/components/media/Lightbox"), { ssr: false });

export default function GenerationFeed() {
  const { generations, pending, error } = useFeed();
  const [open, setOpen] = useState(null); // { generationId, index }

  // Bring the new pending group into view when a generation starts.
  const pendingId = pending?.id;
  useEffect(() => {
    if (pendingId) document.getElementById(pendingId)?.scrollIntoView({ behavior: smoothBehavior(), block: "start" });
  }, [pendingId]);

  const handleOpen = useCallback((generationId, index) => setOpen({ generationId, index }), []);
  const handleClose = useCallback(() => setOpen(null), []);
  const handleNavigate = useCallback((index) => setOpen((prev) => prev && { ...prev, index }), []);

  // One list, so the pending group and its finished result share a React key (clientId) and don't remount.
  const groups = pending ? [pending, ...generations] : generations;
  const openGeneration = open && generations.find((g) => g.id === open.generationId);

  let status = "";
  if (pending) status = `Generating ${pending.count} ${pending.mode === "video" ? "video" : pending.count === 1 ? "image" : "images"}`;
  else if (error) status = `Generation failed. ${error}`;
  else if (generations[0]?.fresh) status = `Generated ${generations[0].items.length} ${generations[0].items.length === 1 ? "item" : "items"}`;

  return (
    <main id="feed" tabIndex={-1} aria-label="Generations" className={`outline-none min-w-0 flex-1 lg:overflow-y-auto lg:pr-2 ${styles.scroll}`}>
      <h2 className="sr-only">Generations</h2>
      <p className="sr-only" aria-live="polite">
        {status}
      </p>
      {groups.length === 0 && <EmptyFeed />}
      <div className="flex flex-col gap-6">
        {groups.map((generation, index) => (
          <GenerationGroup key={generation.clientId ?? generation.id} generation={generation} onOpen={handleOpen} priority={index === 0} />
        ))}
      </div>
      {openGeneration && (
        <Lightbox generation={openGeneration} index={open.index} onNavigate={handleNavigate} onClose={handleClose} />
      )}
    </main>
  );
}

"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useGenerationDispatch } from "@/context/GenerationContext";
import { NAV_ITEMS } from "@/lib/constants";

// Empty state for the sections that aren't built yet.
export default function ComingSoon({ id, message }) {
  const dispatch = useGenerationDispatch();
  const { icon: Icon } = NAV_ITEMS.find((item) => item.id === id);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="grid flex-1 place-items-center px-4 pb-[calc(3.5rem+env(safe-area-inset-bottom))] outline-none md:px-6 md:pb-6"
    >
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <span aria-hidden="true" className="grid size-16 place-items-center rounded-full bg-panel text-ink">
          <Icon size={28} strokeWidth={1.5} />
        </span>
        <h2 className="text-xl font-semibold">{message}</h2>
        <p className="text-13 text-ink-muted">We&apos;re still building this part of Fomi. In the meantime you can keep creating.</p>
        <Link
          href="/"
          onClick={() => dispatch({ type: "SET_MODE", mode: "image" })}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-13 font-semibold text-on-accent transition-all duration-150 hover:-translate-y-px hover:shadow-md active:scale-[0.97]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Image
        </Link>
      </div>
    </main>
  );
}

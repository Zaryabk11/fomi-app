import { memo } from "react";
import MediaGrid from "./MediaGrid";
import PromptCard from "./PromptCard";

function GenerationGroup({ generation, onOpen, priority = false }) {
  const { pending, fresh } = generation;

  return (
    <section
      id={generation.id}
      role="group"
      aria-label={`Generation: ${generation.prompt.slice(0, 60)}`}
      aria-busy={pending || undefined}
      className={`scroll-mt-40 lg:scroll-mt-0 grid gap-3 md:gap-4 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-start ${pending || fresh ? "animate-slide-in" : ""}`}
    >
      <PromptCard generation={generation} />
      <MediaGrid
        generationId={generation.id}
        items={generation.items}
        skeleton={pending ? { count: generation.count, ratio: generation.ratio } : null}
        onOpen={onOpen}
        priority={priority}
      />
    </section>
  );
}

export default memo(GenerationGroup);

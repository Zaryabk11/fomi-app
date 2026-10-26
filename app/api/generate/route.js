import clips from "@/data/mockVideos.json";
import { DURATIONS, MODELS, RATIOS } from "@/lib/constants";

const MIN_DELAY_MS = 1500;
const MAX_DELAY_MS = 3000;
const FAILURE_RATE = 1 / 15;
const MAX_COUNT = 4;

// Pixel size per aspect ratio (long edge 1024).
const DIMENSIONS = {
  "1:1": [896, 896],
  "3:4": [768, 1024],
  "4:3": [1024, 768],
  "9:16": [576, 1024],
  "16:9": [1024, 576],
};

const NEUTRAL_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjIiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmNmU5ZTMiLz48L3N2Zz4=";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// A 10px-wide version of the same photo, inlined as the blur placeholder.
async function fetchBlur(seed, width, height) {
  try {
    const res = await fetch(`https://picsum.photos/seed/${seed}/10/${Math.round((10 * height) / width)}.jpg`);
    if (!res.ok) return NEUTRAL_BLUR;
    const bytes = Buffer.from(await res.arrayBuffer());
    return `data:image/jpeg;base64,${bytes.toString("base64")}`;
  } catch {
    return NEUTRAL_BLUR;
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) return Response.json({ error: "Prompt is required" }, { status: 400 });

  const ratio = RATIOS.includes(body.ratio) ? body.ratio : "1:1";
  const model = MODELS.includes(body.model) ? body.model : MODELS[0];
  const count = Math.min(Math.max(Number(body.count) || 1, 1), MAX_COUNT);
  const mode = body.mode === "video" ? "video" : "image";
  const duration = DURATIONS.includes(Number(body.duration)) ? Number(body.duration) : DURATIONS[0];

  await sleep(MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS));

  if (process.env.MOCK_API_ERRORS !== "off" && Math.random() < FAILURE_RATE) {
    return Response.json({ error: "Generation failed. Please try again." }, { status: 500 });
  }

  const [width, height] = DIMENSIONS[ratio];
  const id = `gen_${Date.now().toString(36)}`;
  const hasSeed = typeof body.seed === "number" || (typeof body.seed === "string" && /^[\w-]{1,32}$/.test(body.seed));
  const items = await Promise.all(
    Array.from({ length: count }, async (_, i) => {
      // A user-supplied seed makes the same request return the same photos.
      const seed = `${hasSeed ? body.seed : id}-${i + 1}`;
      const photo = `https://picsum.photos/seed/${seed}/${width}/${height}.jpg`;
      const shared = { id: `${id}_m${i + 1}`, width, height, blurDataURL: await fetchBlur(seed, width, height) };
      if (mode === "video") {
        // Clips come from a small local pool (cropped to the ratio by the tile); the photo is the poster.
        return {
          ...shared,
          type: "video",
          src: clips[Math.floor(Math.random() * clips.length)],
          poster: photo,
          duration,
          alt: `Generated video for "${prompt.slice(0, 60)}"`,
        };
      }
      return { ...shared, type: "image", src: photo, alt: `Generated image ${i + 1} of ${count} for "${prompt.slice(0, 60)}"` };
    })
  );

  return Response.json({
    id,
    prompt,
    mode,
    model,
    ratio,
    style: typeof body.style === "string" ? body.style : "None",
    createdAt: new Date().toISOString(),
    items,
  });
}

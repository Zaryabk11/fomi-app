// One-off: downloads sample photos from picsum.photos into public/mock and rebuilds the mock JSON.
// Usage: node scripts/seed-mock-data.mjs
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT_DIR = path.resolve("public/mock");
const PORTRAIT_PROMPT =
  "A professional portrait photograph of a smiling 31-year-old redheaded woman with warm brown eyes and softly tousled auburn hair framing her face. She is turned slightly towards the viewer, offering a genuine and approachable expression. She is wearing a cream-colored cashmere sweater and delicate gold earrings. The background is a softly blurred expanse of muted grey and beige tones, suggesting a modern art gallery. There is subtle directional lighting";

// Newest first. `count` photos per group at the group's ratio.
const GROUPS = [
  { id: "gen_6", prompt: PORTRAIT_PROMPT, ratio: "3:4", size: [768, 1024], count: 4, style: "Portrait", model: "Fomi Realism v2", createdAt: "2026-10-25T10:20:00Z" },
  { id: "gen_5", prompt: PORTRAIT_PROMPT, ratio: "3:4", size: [768, 1024], count: 4, style: "Portrait", model: "Fomi Realism v2", createdAt: "2026-10-25T10:00:00Z" },
  { id: "gen_4", prompt: "Neon-lit street in Tokyo after the rain, reflections on wet asphalt, cinematic wide shot, shallow depth of field", ratio: "16:9", size: [1024, 576], count: 4, style: "Cinematic", model: "Fomi Studio", createdAt: "2026-10-25T09:15:00Z" },
  { id: "gen_3", prompt: "A cozy wooden cabin in a snowy pine forest at dusk, warm light glowing from the windows, soft falling snow", ratio: "4:3", size: [1024, 768], count: 4, style: "Film", model: "Fomi Realism v2", createdAt: "2026-10-24T17:40:00Z" },
  { id: "gen_2", prompt: "Minimalist product photo of a glass perfume bottle on a pale pink pedestal, soft studio shadows", ratio: "1:1", size: [896, 896], count: 4, style: "None", model: "Fomi Fast", createdAt: "2026-10-24T14:05:00Z" },
  { id: "gen_1", prompt: "A lone astronaut standing on a dune under two moons, tall vertical composition, painterly sci-fi concept art", ratio: "9:16", size: [576, 1024], count: 4, style: "3D", model: "Fomi Anime", createdAt: "2026-10-23T21:30:00Z" },
];


const get = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
};

const blurDataURL = async (buffer) => {
  const tiny = await sharp(buffer).resize(10).jpeg({ quality: 50 }).toBuffer();
  return `data:image/jpeg;base64,${tiny.toString("base64")}`;
};

await mkdir(OUT_DIR, { recursive: true });
for (const file of await readdir(OUT_DIR)) await rm(path.join(OUT_DIR, file));

const list = JSON.parse((await get("https://picsum.photos/v2/list?page=2&limit=60")).toString());
let cursor = 0;

const generations = [];
for (const group of GROUPS) {
  const items = [];
  for (let i = 0; i < group.count; i++) {
    const photo = list[cursor++];
    const [width, height] = group.size;
    const file = `${group.id}-${i + 1}.jpg`;
    const buffer = await get(`https://picsum.photos/id/${photo.id}/${width}/${height}.jpg`);
    await writeFile(path.join(OUT_DIR, file), buffer);
    items.push({
      id: `${group.id}_m${i + 1}`,
      type: "image",
      src: `/mock/${file}`,
      width,
      height,
      alt: `Sample photo by ${photo.author}`,
      blurDataURL: await blurDataURL(buffer),
    });
    process.stdout.write(".");
  }
  const { size, count, ...meta } = group;
  generations.push({ ...meta, mode: "image", items });
}

// Video group: two short CC0 clips from MDN, each with a Picsum photo as its poster.
const CLIPS = [
  { file: "flower.mp4", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", alt: "Time-lapse of a flower blooming" },
  { file: "friday.mp4", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4", alt: "Short sample clip with moving lights" },
];
const [videoWidth, videoHeight] = [1024, 576];
const videoItems = [];
for (const [i, clip] of CLIPS.entries()) {
  const photo = list[cursor++];
  await writeFile(path.join(OUT_DIR, clip.file), await get(clip.url));
  const poster = await get(`https://picsum.photos/id/${photo.id}/${videoWidth}/${videoHeight}.jpg`);
  await writeFile(path.join(OUT_DIR, `video-${i + 1}-poster.jpg`), poster);
  videoItems.push({
    id: `gen_v1_m${i + 1}`,
    type: "video",
    src: `/mock/${clip.file}`,
    poster: `/mock/video-${i + 1}-poster.jpg`,
    duration: 5,
    width: videoWidth,
    height: videoHeight,
    alt: clip.alt,
    blurDataURL: await blurDataURL(poster),
  });
  process.stdout.write("v");
}
generations.splice(2, 0, {
  id: "gen_v1",
  prompt: "Slow cinematic pan across a meadow of wildflowers in soft morning light, shallow depth of field",
  ratio: "16:9",
  style: "Cinematic",
  model: "Fomi Studio",
  createdAt: "2026-10-25T09:40:00Z",
  mode: "video",
  items: videoItems,
});
await writeFile(path.resolve("data/mockVideos.json"), JSON.stringify(CLIPS.map((c) => `/mock/${c.file}`), null, 2) + "\n");

// Avatar for the header.
const avatar = await get("https://picsum.photos/id/64/96/96.jpg");
await writeFile(path.join(OUT_DIR, "avatar.jpg"), avatar);

await writeFile(path.resolve("data/mockGenerations.json"), JSON.stringify(generations, null, 2) + "\n");
console.log(`\nWrote ${generations.length} generations.`);

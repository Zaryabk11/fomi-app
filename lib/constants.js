import { Folder, House, Image as ImageIcon, Video, WandSparkles } from "lucide-react";

// Image and Video are the same page (/) in two modes; the rest are placeholder routes.
export const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/home", icon: House },
  { id: "image", label: "Image", href: "/", icon: ImageIcon },
  { id: "video", label: "Video", href: "/", icon: Video },
  { id: "edit", label: "Edit", href: "/edit", icon: WandSparkles },
  { id: "library", label: "Library", href: "/library", icon: Folder },
];

// Copy for the placeholder pages at /home, /edit and /library.
export const SECTIONS = {
  home: { title: "Home", message: "Your home dashboard is coming soon" },
  edit: { title: "Edit", message: "Editing workspace is coming soon" },
  library: { title: "Library", message: "Your library is coming soon" },
};

// Clickable suggestions shown when the feed is empty.
export const EXAMPLE_PROMPTS = {
  image: [
    "A cozy reading nook with warm lamplight, rain on the window, shallow depth of field",
    "Portrait of an astronaut in a wildflower meadow, golden hour, 85mm film look",
    "Minimalist poster of a lighthouse at dawn, pastel gradient sky, clean shapes",
  ],
  video: [
    "Slow dolly through a misty pine forest at sunrise, volumetric light",
    "Paper boats drifting down a rainy neon-lit street, cinematic, shallow focus",
    "Timelapse of clouds rolling over a mountain ridge, soft golden light",
  ],
};

export const MODES = [
  { id: "image", label: "Image" },
  { id: "video", label: "Video" },
];

export const RATIOS = ["1:1", "3:4", "4:3", "9:16", "16:9"];

export const MODELS = ["Fomi Realism v2", "Fomi Studio", "Fomi Anime", "Fomi Fast"];

export const COUNTS = [1, 2, 3, 4];

export const DURATIONS = [5, 10];

// Sample thumbnails from picsum.photos (public/styles); "None" has no image.
export const STYLES = [
  { id: "Cinematic", src: "/styles/cinematic.jpg" },
  { id: "Portrait", src: "/styles/portrait.jpg" },
  { id: "Anime", src: "/styles/anime.jpg" },
  { id: "3D", src: "/styles/3d.jpg" },
  { id: "Film", src: "/styles/film.jpg" },
  { id: "None", src: null },
];

export const SEED_MAX = 999_999_999;

export const PROMPT_MAX_LENGTH = 1000;

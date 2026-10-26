export const OPEN_COMPOSER_EVENT = "fomi:open-composer";

// JS-driven smooth scrolling ignores the CSS media query, so check it here.
export const smoothBehavior = () => (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

export const formatDuration = (seconds) => `0:${String(seconds).padStart(2, "0")}`;

// Focuses the prompt that is on screen. The mobile layout has none until its sheet opens, so ask it to open.
export function focusPrompt() {
  const el = [...document.querySelectorAll("[data-prompt-input]")].find((node) => node.getClientRects().length);
  if (!el) {
    window.dispatchEvent(new Event(OPEN_COMPOSER_EVENT));
    return;
  }
  el.focus();
  el.setSelectionRange?.(el.value.length, el.value.length);
}

// Fetch as a blob so the browser saves the file instead of navigating; fall back to a new tab if CORS blocks it.
export async function downloadFile(src, filename) {
  try {
    const res = await fetch(src);
    if (!res.ok) throw new Error(String(res.status));
    const url = URL.createObjectURL(await res.blob());
    const link = Object.assign(document.createElement("a"), { href: url, download: filename });
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch {
    window.open(src, "_blank", "noopener");
    return false;
  }
}

// Scroll a generation group into view and flash it so the eye finds it.
export function revealGroup(groupId) {
  const el = document.getElementById(groupId);
  if (!el) return;
  el.scrollIntoView({ behavior: smoothBehavior(), block: "start" });
  el.classList.remove("group-highlight");
  void el.offsetWidth; // restart the animation if it is already running
  el.classList.add("group-highlight");
  el.addEventListener("animationend", () => el.classList.remove("group-highlight"), { once: true });
}

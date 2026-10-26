import Tooltip from "./Tooltip";

const VARIANTS = {
  // Sits on top of photos, so it carries its own backdrop.
  overlay: "bg-black/55 text-white backdrop-blur-sm hover:bg-black/75",
  plain: "text-ink hover:bg-accent-soft",
};

// Icon-only button: aria-label plus a matching tooltip.
export default function IconButton({ label, icon: Icon, pressed, variant = "plain", size = 28, tooltipSide = "bottom", tooltipAlign = "center", filled = false, className = "", ...props }) {
  return (
    <Tooltip label={label} side={tooltipSide} align={tooltipAlign}>
      <button
        type="button"
        aria-label={label}
        aria-pressed={pressed}
        className={`grid shrink-0 place-items-center rounded-full transition-colors duration-150 ${VARIANTS[variant]} ${className}`}
        style={{ width: size, height: size }}
        {...props}
      >
        <Icon size={Math.round(size * 0.55)} aria-hidden="true" className={filled ? "fill-current" : ""} />
      </button>
    </Tooltip>
  );
}

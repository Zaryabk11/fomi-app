const VARIANTS = {
  pill: "rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-ink hover:bg-accent-soft",
};

export default function Button({ variant = "pill", icon: Icon, children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 font-medium transition-colors duration-150 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={14} aria-hidden="true" />}
      {children}
    </button>
  );
}

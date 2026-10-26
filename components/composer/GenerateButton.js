import { Loader2, Sparkles } from "lucide-react";

export default function GenerateButton({ disabled, loading }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      // aria-disabled (not disabled) while loading keeps keyboard focus on the button.
      aria-disabled={loading || undefined}
      onClick={loading ? (event) => event.preventDefault() : undefined}
      className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-13 font-semibold text-on-accent transition-all duration-150 hover:-translate-y-px hover:shadow-md active:scale-[0.97] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none aria-disabled:cursor-progress aria-disabled:hover:translate-y-0 aria-disabled:hover:shadow-none aria-disabled:active:scale-100"
    >
      {loading ? (
        <Loader2 size={16} aria-hidden="true" className="animate-spin" />
      ) : (
        <Sparkles size={16} aria-hidden="true" />
      )}
      {loading ? "Generating…" : "Generate"}
    </button>
  );
}

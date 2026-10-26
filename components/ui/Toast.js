import { AlertCircle, CheckCircle2, X } from "lucide-react";

const VARIANT_ICON = {
  success: <CheckCircle2 size={16} aria-hidden="true" className="shrink-0" />,
  error: <AlertCircle size={16} aria-hidden="true" className="shrink-0" />,
};

export default function Toast({ toast, onDismiss }) {
  const { id, message, variant, action } = toast;

  return (
    <div className="pointer-events-auto flex animate-toast-in items-center gap-3 rounded-full bg-ink py-2 pl-4 pr-2 text-13 text-bg shadow-lg">
      {VARIANT_ICON[variant]}
      <span>{message}</span>
      {action && (
        <button
          type="button"
          onClick={() => {
            action.onClick();
            onDismiss(id);
          }}
          className="rounded-full px-3 py-1 text-xs font-semibold underline underline-offset-2 transition-colors duration-150 hover:bg-bg/10"
        >
          {action.label}
        </button>
      )}
      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        title="Dismiss"
        className="grid size-6 place-items-center rounded-full transition-colors duration-150 hover:bg-bg/10"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

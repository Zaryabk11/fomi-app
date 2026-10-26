"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import Tooltip from "./Tooltip";

// Icon visibility is driven by the data-theme attribute in CSS, so there is no flash before hydration.
const ICON = "absolute transition-all duration-250 ease-out";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <Tooltip label={`Switch to ${next} theme`} align="end">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${next} theme`}
        className="relative grid size-8 place-items-center rounded-full text-ink transition-colors duration-150 hover:bg-accent-soft"
      >
        <Moon size={16} aria-hidden="true" className={`${ICON} rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-0 dark:opacity-0`} />
        <Sun size={16} aria-hidden="true" className={`${ICON} rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100`} />
      </button>
    </Tooltip>
  );
}

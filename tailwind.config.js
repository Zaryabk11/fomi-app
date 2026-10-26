/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./context/**/*.{js,jsx}", "./hooks/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  darkMode: ["variant", '&:is([data-theme="dark"] *)'],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        panel: "var(--panel)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        focus: "var(--focus)",
        "on-accent": "var(--on-accent)",
        ink: "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        line: "var(--border)",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["12px", "16px"],
        "13": ["13px", "20px"],
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        xl: ["20px", "28px"],
      },
      borderRadius: {
        chip: "8px",
        tile: "12px",
        panel: "16px",
      },
      screens: {
        "3xl": "1536px",
      },
      keyframes: {
        "slide-in": {
          from: { opacity: "0", transform: "translateY(-12px)" },
          to: { opacity: "1", transform: "none" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.7)" },
          to: { opacity: "1", transform: "none" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "thumb-in": {
          from: { opacity: "0", transform: "translateY(6px) scale(0.96)" },
          to: { opacity: "1", transform: "none" },
        },
        "dialog-out": {
          from: { opacity: "1", transform: "none" },
          to: { opacity: "0", transform: "scale(0.96)" },
        },
        "sheet-out": {
          from: { transform: "none" },
          to: { transform: "translateY(100%)" },
        },
        "dialog-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "none" },
        },
        "sheet-in": {
          from: { transform: "translateY(100%)" },
          to: { transform: "none" },
        },
        "toast-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        "slide-in": "slide-in 300ms ease-out both",
        // backwards (not both): the end state must not stay pinned, or it would override hover transforms
        "scale-in": "scale-in 250ms ease-out backwards",
        "toast-in": "toast-in 200ms ease-out both",
        "dialog-in": "dialog-in 300ms ease-out both",
        "fade-in": "fade-in 300ms ease-out backwards",
        "thumb-in": "thumb-in 250ms ease-out backwards",
        "dialog-out": "dialog-out 200ms ease-in both",
        "sheet-out": "sheet-out 200ms ease-in both",
        "sheet-in": "sheet-in 300ms ease-out both",
      },
      transitionDuration: {
        150: "150ms",
        250: "250ms",
        300: "300ms",
      },
    },
  },
  plugins: [],
};

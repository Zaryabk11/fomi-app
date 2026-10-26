"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Headphones, LayoutGrid, LogOut, Settings, User } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Tooltip from "@/components/ui/Tooltip";
import { useToast } from "@/context/ToastContext";

// `mobileOnly` items duplicate the Gallery / Support pills that are hidden in the header below md.
const ITEMS = [
  { label: "Profile", icon: User },
  { label: "Settings", icon: Settings },
  { label: "Gallery", icon: LayoutGrid, mobileOnly: true },
  { label: "Support", icon: Headphones, mobileOnly: true },
  { label: "Sign out", icon: LogOut, separated: true },
];

export default function AvatarMenu() {
  const id = useId();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const items = () => [...(menuRef.current?.querySelectorAll('[role="menuitem"]') ?? [])].filter((el) => el.offsetParent);

  useEffect(() => {
    if (!open) return;
    items()[0]?.focus();
    const onPointerDown = (event) => {
      if (!menuRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const handleMenuKeyDown = (event) => {
    const list = items();
    const index = list.indexOf(document.activeElement);
    const move = { ArrowDown: (index + 1) % list.length, ArrowUp: (index - 1 + list.length) % list.length, Home: 0, End: list.length - 1 }[event.key];
    if (move !== undefined) {
      event.preventDefault();
      list[move].focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab") {
      close(false);
    }
  };

  return (
    <div className="relative">
      <Tooltip label="Account" align="end">
        <button
          ref={triggerRef}
          type="button"
          aria-label="Account menu"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={`${id}-menu`}
          onClick={() => setOpen((prev) => !prev)}
          className="block rounded-full"
        >
          <Avatar src="/mock/avatar.jpg" alt="" size={28} />
        </button>
      </Tooltip>
      {open && (
        <ul
          ref={menuRef}
          id={`${id}-menu`}
          role="menu"
          aria-label="Account"
          onKeyDown={handleMenuKeyDown}
          className="absolute right-0 top-full z-40 mt-2 w-48 animate-toast-in rounded-tile border border-line bg-surface p-1 shadow-lg"
        >
          {ITEMS.map(({ label, icon: Icon, mobileOnly, separated }) => (
            <li key={label} role="none" className={`${mobileOnly ? "md:hidden" : ""} ${separated ? "mt-1 border-t border-line pt-1" : ""}`}>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  close();
                  toast(`${label} isn't available in this demo`);
                }}
                className="flex w-full items-center gap-2.5 rounded-chip px-2.5 py-2 text-13 text-ink transition-colors duration-150 hover:bg-accent-soft focus-visible:bg-accent-soft"
              >
                <Icon size={16} aria-hidden="true" className="text-ink-muted" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

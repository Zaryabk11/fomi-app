"use client";

import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import usePrimaryNav from "@/hooks/usePrimaryNav";
import styles from "./MobileTabBar.module.css";

export const TAB_BAR_HEIGHT = 56;

export default function MobileTabBar() {
  const { activeId, activeIndex, refs, select, handleKeyDown } = usePrimaryNav();

  return (
    <nav
      aria-label="Primary mobile"
      className={`${styles.bar} fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface md:hidden`}
    >
      <ul className={styles.items} style={{ "--index": activeIndex }}>
        <li aria-hidden="true" className={styles.indicator} />
        {NAV_ITEMS.map(({ id, label, href, icon: Icon }, index) => {
          const active = id === activeId;
          return (
            <li key={id}>
              <Link
                ref={(el) => (refs.current[index] = el)}
                href={href}
                aria-current={active ? "page" : undefined}
                onClick={() => select(id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                style={{ height: TAB_BAR_HEIGHT }}
                className={`flex w-full flex-col items-center justify-center gap-0.5 text-xs transition-colors duration-150 ${
                  active ? "font-semibold text-ink" : "text-ink-muted"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.25 : 1.75} aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

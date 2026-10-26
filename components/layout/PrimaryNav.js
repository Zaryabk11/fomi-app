"use client";

import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import usePrimaryNav from "@/hooks/usePrimaryNav";
import Tooltip from "@/components/ui/Tooltip";
import styles from "./PrimaryNav.module.css";

export default function PrimaryNav() {
  const { activeId, activeIndex, refs, select, handleKeyDown } = usePrimaryNav();

  return (
    <nav aria-label="Primary" className={`${styles.nav} hidden md:block`} style={{ "--index": activeIndex }}>
      <div className={styles.track} aria-hidden="true">
        <div className={styles.indicator} />
      </div>
      <ul className={styles.items}>
        {NAV_ITEMS.map(({ id, label, href, icon: Icon }, index) => {
          const active = id === activeId;
          return (
            <li key={id} className="flex justify-center">
              <Tooltip label={label}>
                <Link
                  ref={(el) => (refs.current[index] = el)}
                  href={href}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  onClick={() => select(id)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className={`grid size-10 place-items-center rounded-full transition-colors duration-150 hover:bg-accent-soft ${
                    active ? "text-ink" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.25 : 1.75} aria-hidden="true" />
                </Link>
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

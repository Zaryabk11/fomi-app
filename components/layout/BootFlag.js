"use client";

import { useEffect } from "react";

// The load animation (header, composer, history thumbs) should play once per visit, not on every route change.
// Once it has had time to finish, flag the document so CSS switches the .boot animations off for later mounts.
export default function BootFlag() {
  useEffect(() => {
    const timer = setTimeout(() => document.documentElement.setAttribute("data-booted", ""), 1500);
    return () => clearTimeout(timer);
  }, []);

  return null;
}

"use client";

import { useSyncExternalStore } from "react";

const XS_QUERY = "(max-width: 639px)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(XS_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(XS_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/** True when the viewport is narrower than 640px (the DSL's `bp=xs`). */
export function useBreakpoint(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

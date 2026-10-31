"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** One step of a frame chain, mirroring the DSL's set/clear/wait verbs. */
export type ChainOp =
  | { set: string }
  | { clear: string }
  | { wait: number }
  | { call: () => void };

/**
 * Boolean UI flags plus timed frame chains. Every pending timer is tracked and
 * cancelled on unmount, so a chain never fires after the screen is gone.
 */
export function useFlags() {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>[]>());

  const set = useCallback((key: string) => {
    setFlags((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  }, []);

  const clear = useCallback((key: string) => {
    setFlags((prev) => (prev[key] ? { ...prev, [key]: false } : prev));
  }, []);

  const toggle = useCallback((key: string) => {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const run = useCallback(
    (name: string, ops: ChainOp[]) => {
      timers.current.get(name)?.forEach(clearTimeout);
      const pending: ReturnType<typeof setTimeout>[] = [];
      let at = 0;
      for (const op of ops) {
        if ("wait" in op) {
          at += op.wait;
          continue;
        }
        const exec = () => {
          if ("set" in op) set(op.set);
          else if ("clear" in op) clear(op.clear);
          else op.call();
        };
        if (at === 0) exec();
        else pending.push(setTimeout(exec, at));
      }
      timers.current.set(name, pending);
    },
    [set, clear],
  );

  useEffect(() => {
    const all = timers.current;
    return () => {
      all.forEach((list) => list.forEach(clearTimeout));
      all.clear();
    };
  }, []);

  return { flags, set, clear, toggle, run };
}

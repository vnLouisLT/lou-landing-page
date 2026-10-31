"use client";

import { useEffect, useRef } from "react";
import { Button, Progress, Spacer } from "./ui";

const FOCUSABLE = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

/** The tour modal: Escape closes, Tab stays inside, focus returns on close. */
export function TourModal({
  onClose,
  onSignup,
}: {
  onClose: () => void;
  onSignup: () => void;
}) {
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const opener = document.activeElement as HTMLElement | null;
    node.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !node.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !node.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialog}
        data-testid="tour"
        role="dialog"
        aria-modal="true"
        aria-label="The tour"
        className="flex min-h-72 w-full max-w-xl flex-col gap-4 border-2 border-border bg-muted p-6 shadow-[0_0_28px_var(--border)]"
      >
        <h2 className="font-display text-xl font-black uppercase tracking-widest text-accent">
          The tour
        </h2>
        <p data-testid="tour.tourBody">
          Three stops: the garage, the highway, the sunset. Press play and keep
          your eyes on the horizon.
        </p>
        <Progress testId="tour.tourProg" label="Tour progress" value={40} />
        <Spacer testId="tour.tourPush" />
        <div data-testid="tour.tourActions" className="flex items-center gap-3">
          <Button testId="tour.tourSkip" onClick={onClose}>
            Skip
          </Button>
          <Spacer testId="tour.tourGap" />
          <Button testId="tour.tourSign" variant="primary" onClick={onSignup}>
            Join the crew
          </Button>
        </div>
      </div>
    </div>
  );
}

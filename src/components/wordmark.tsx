export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-baseline gap-2 font-display font-black uppercase tracking-widest ${className}`}
    >
      <span
        className="text-accent"
        style={{ textShadow: "0 0 8px var(--accent), 0 0 18px var(--accent)" }}
      >
        Neon
      </span>
      <span
        className="text-muted-foreground"
        style={{ textShadow: "0 0 8px var(--border)" }}
      >
        Drive
      </span>
      <span className="text-foreground">&apos;90</span>
    </span>
  );
}

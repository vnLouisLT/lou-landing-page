export function Stat({
  testId,
  label,
  value,
  delta,
  caption,
  trend,
  hint,
}: {
  testId: string;
  label: string;
  value: string;
  delta?: string;
  caption?: string;
  trend?: "up";
  hint?: string;
}) {
  return (
    <div
      data-testid={testId}
      role="group"
      aria-label={label}
      className="flex flex-1 flex-col gap-1 border-2 border-border p-4"
    >
      <span className="text-sm uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="flex items-baseline gap-2">
        <span className="font-display text-3xl font-black text-foreground">
          {value}
        </span>
        {delta && <span className="text-accent">{delta}</span>}
        {trend === "up" && (
          <span aria-label="trending up" className="text-accent">
            &#9650;
          </span>
        )}
      </span>
      {(caption ?? hint) && (
        <span className="text-muted-foreground">{caption ?? hint}</span>
      )}
    </div>
  );
}

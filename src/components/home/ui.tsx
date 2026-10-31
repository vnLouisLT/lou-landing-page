import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "default" | "ghost";

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary:
    "border-2 border-accent bg-accent text-accent-foreground shadow-[0_0_10px_var(--accent)] hover:shadow-[0_0_22px_var(--accent)]",
  default:
    "border-2 border-border text-foreground hover:shadow-[0_0_14px_var(--border)]",
  ghost:
    "border-2 border-transparent text-muted-foreground hover:border-border hover:shadow-[0_0_14px_var(--border)]",
};

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  testId: string;
  variant?: ButtonVariant;
};

export function Button({
  testId,
  variant = "default",
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      data-testid={testId}
      className={`cursor-pointer px-4 py-1 font-display text-sm font-bold uppercase tracking-widest transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${BUTTON_STYLES[variant]} ${className}`}
      {...rest}
    />
  );
}

/** A text-styled control (the DSL's clickable `text`). */
export function TextButton({
  testId,
  className = "",
  ...rest
}: Omit<ButtonProps, "variant">) {
  return (
    <button
      type="button"
      data-testid={testId}
      className={`cursor-pointer text-left text-muted-foreground hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${className}`}
      {...rest}
    />
  );
}

export function Spacer({ testId }: { testId: string }) {
  return <div aria-hidden="true" data-testid={testId} className="flex-1" />;
}

export function Divider({ testId }: { testId: string }) {
  return <hr data-testid={testId} className="border-t-2 border-border/60" />;
}

export function Title({
  testId,
  as: Tag = "h2",
  className = "",
  children,
}: {
  testId: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      data-testid={testId}
      className={`font-display font-black uppercase tracking-widest ${className}`}
    >
      {children}
    </Tag>
  );
}

export function Panel({
  testId,
  label,
  className = "",
  children,
}: {
  testId: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      data-testid={testId}
      aria-label={label}
      className={`border-2 border-border p-4 ${className}`}
    >
      <p
        aria-hidden="true"
        className="mb-2 font-display text-xs uppercase tracking-widest text-muted-foreground"
      >
        {label}
      </p>
      {children}
    </section>
  );
}

/** A static sample bar: the screen never drives its value. */
export function Progress({
  testId,
  label,
  value,
}: {
  testId: string;
  label: string;
  value: number;
}) {
  return (
    <div
      data-testid={testId}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="flex flex-col gap-1"
    >
      <span className="text-sm uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="block h-3 w-full border-2 border-border bg-muted">
        <span
          className="block h-full bg-accent shadow-[0_0_8px_var(--accent)]"
          style={{ width: `${value}%` }}
        />
      </span>
    </div>
  );
}

export function Spinner({ testId, label }: { testId: string; label: string }) {
  return (
    <div
      data-testid={testId}
      role="status"
      className="flex items-center gap-2 text-muted-foreground"
    >
      <span
        aria-hidden="true"
        className="inline-block size-4 animate-spin border-2 border-accent border-t-transparent"
      />
      {label}
    </div>
  );
}

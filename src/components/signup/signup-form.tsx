"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/toast";
import { Wordmark } from "@/components/wordmark";

const SPIN_MS = 900;
const CARS = ["DeLorean", "Testarossa", "Countach", "Firebird"] as const;
const TAPES = ["Coast (free)", "Turbo", "Chrome"] as const;

const fieldClass =
  "w-full border-2 border-border bg-background px-3 py-2 text-xl text-foreground outline-none focus:shadow-[0_0_12px_var(--border)]";
const labelClass = "flex flex-col gap-1 text-muted-foreground";

export function SignupForm() {
  const router = useRouter();
  const toast = useToast();
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [car, setCar] = useState<string>(CARS[0]);
  const [tape, setTape] = useState<string>(TAPES[0]);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") router.push("/");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  const start = useCallback(() => {
    if (spinning) return;
    if (handle.trim() === "") {
      setError("Pick a handle to get on the road");
      return;
    }
    setError(null);
    setSpinning(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      toast("Engine running");
      router.push("/");
    }, SPIN_MS);
  }, [spinning, handle, toast, router]);

  const handleEmpty = handle.trim() === "";

  return (
    <main className="flex flex-1 flex-col">
      <span data-testid="signup.suEsc" hidden />
      <header
        data-testid="signup.suNav"
        className="flex w-full items-center gap-4 px-4 py-4"
      >
        <Link href="/" data-testid="signup.suWordmark">
          <Wordmark className="text-2xl" />
        </Link>
        <span data-testid="signup.suNavPush" className="flex-1" />
        <Link
          href="/"
          data-testid="signup.suBack"
          className="text-muted-foreground hover:text-accent"
        >
          Back to the road
        </Link>
      </header>
      <hr data-testid="signup.suNavRule" className="border-border" />

      <div data-testid="signup.suWrap" className="flex flex-1 flex-col px-4">
        <div data-testid="signup.suTop" className="flex-1" />
        <div data-testid="signup.suRow" className="flex w-full items-start">
          <div data-testid="signup.suLeft" className="flex-1" />
      <form
        data-testid="signup.suPanel"
        aria-labelledby="signup-title"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          start();
        }}
        className="flex w-full max-w-xl flex-col gap-5 border-2 border-border bg-muted p-6 shadow-[0_0_18px_var(--border)]"
      >
        <h1
          id="signup-title"
          className="text-2xl font-black uppercase tracking-widest text-accent"
          style={{ textShadow: "0 0 8px var(--accent)" }}
        >
          PLAYER ONE: CREATE ACCOUNT
        </h1>

        <label className={labelClass}>
          Handle
          <input
            type="text"
            placeholder="NightRider90"
            data-testid="signup.suName"
            value={handle}
            autoComplete="username"
            aria-invalid={error !== null}
            aria-describedby={error !== null ? "signup-error" : undefined}
            onChange={(event) => {
              setHandle(event.target.value);
              if (error) setError(null);
            }}
            className={fieldClass}
          />
        </label>
        {error !== null && (
          <p id="signup-error" role="alert" className="-mt-3 text-danger">
            {error}
          </p>
        )}

        <label className={labelClass}>
          Email
          <input
            type="email"
            placeholder="you@neondrive.example"
            data-testid="signup.suEmail"
            value={email}
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClass}
          />
        </label>

        <label className={labelClass}>
          Your ride
          <select
            data-testid="signup.suCar"
            value={car}
            onChange={(event) => setCar(event.target.value)}
            className={fieldClass}
          >
            {CARS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClass}>
          Tape
          <select
            data-testid="signup.suTape"
            value={tape}
            onChange={(event) => setTape(event.target.value)}
            className={fieldClass}
          >
            {TAPES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-3 text-muted-foreground">
          <input
            type="checkbox"
            data-testid="signup.suTerms"
            checked={terms}
            onChange={(event) => setTerms(event.target.checked)}
            className="size-5 accent-accent"
          />
          I accept the terms of the road
        </label>

        <div data-testid="signup.suActions" className="flex flex-wrap items-center gap-4">
          <Link
            href="/"
            data-testid="signup.suCancel"
            className="border-2 border-border px-4 py-2 text-muted-foreground hover:shadow-[0_0_12px_var(--border)]"
          >
            Cancel
          </Link>
          <span data-testid="signup.suGap" className="flex-1" />
          <button
            type="button"
            data-testid="signup.suGo"
            aria-disabled={handleEmpty}
            onClick={start}
            className={`border-2 border-accent bg-accent px-4 py-2 font-bold uppercase tracking-widest text-accent-foreground hover:shadow-[0_0_14px_var(--accent)] ${
              handleEmpty ? "opacity-50" : ""
            }`}
          >
            Start engine
          </button>
          {spinning && (
            <span
              role="status"
              aria-label="Revving"
              data-testid="signup.suSpin"
              className="inline-block size-6 animate-spin rounded-full border-4 border-border border-t-transparent"
            />
          )}
        </div>
        <hr data-testid="signup.suRule" className="border-border" />
        <Link href="/login" data-testid="signup.suHave" className="text-accent underline">
          Already have a pass? Log in
        </Link>
      </form>
          <div data-testid="signup.suRight" className="flex-1" />
        </div>
        <div data-testid="signup.suBottom" className="flex-1" />
      </div>
    </main>
  );
}

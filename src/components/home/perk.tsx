"use client";

import { useState } from "react";
import { Divider } from "./ui";

export type PerkData = {
  id: string;
  name: string;
  stat: string;
  body: string;
};

/** Perk card: lights up ">> ONLINE <<" while hovered. */
export function Perk({ id, name, stat, body }: PerkData) {
  const [lit, setLit] = useState(false);
  return (
    <div
      data-testid={`home.${id}.card`}
      aria-label={name}
      role="group"
      onMouseEnter={() => setLit(true)}
      onMouseLeave={() => setLit(false)}
      className={`flex flex-1 flex-col gap-2 border-2 border-border bg-muted p-4 transition-shadow ${
        lit ? "shadow-[0_0_18px_var(--accent)]" : ""
      }`}
    >
      <h3 className="font-display text-lg font-bold uppercase tracking-widest text-accent">
        {name}
      </h3>
      <p data-testid={`home.${id}.body`}>{body}</p>
      <Divider testId={`home.${id}.rule`} />
      <p
        data-testid={`home.${id}.stat`}
        className="text-muted-foreground"
      >
        {stat}
      </p>
      {lit && (
        <p
          data-testid={`home.${id}.lit`}
          className="font-display text-sm font-bold tracking-widest text-accent"
        >
          &gt;&gt; ONLINE &lt;&lt;
        </p>
      )}
    </div>
  );
}

import { Button, Spacer, Title } from "./ui";

export type TapeData = {
  id: string;
  name: string;
  price: string;
  blurb: string;
  cta: string;
};

export function Tape({
  id,
  name,
  price,
  blurb,
  cta,
  onBuy,
}: TapeData & { onBuy: () => void }) {
  return (
    <section
      data-testid={`home.${id}.card`}
      aria-label={name}
      className="flex flex-1 flex-col gap-3 border-2 border-border bg-muted p-4"
    >
      <p
        aria-hidden="true"
        className="font-display text-xs uppercase tracking-widest text-muted-foreground"
      >
        {name}
      </p>
      <Title testId={`home.${id}.price`} as="h3" className="text-2xl text-accent">
        {price}
      </Title>
      <p data-testid={`home.${id}.blurb`}>{blurb}</p>
      <Spacer testId={`home.${id}.push`} />
      <Button testId={`home.${id}.buy`} variant="primary" onClick={onBuy}>
        {cta}
      </Button>
    </section>
  );
}

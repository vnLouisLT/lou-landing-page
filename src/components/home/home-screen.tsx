"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type KeyboardEvent } from "react";
import { useBreakpoint } from "@/components/use-breakpoint";
import { useToast } from "@/components/toast";
import { Wordmark } from "@/components/wordmark";
import { Perk, type PerkData } from "./perk";
import { Stat } from "./stat";
import { Tape, type TapeData } from "./tape";
import { TourModal } from "./tour-modal";
import {
  Button,
  Divider,
  Panel,
  Progress,
  Spacer,
  Spinner,
  TextButton,
  Title,
} from "./ui";
import { useFlags, type ChainOp } from "./use-flags";

const PERKS: PerkData[] = [
  {
    id: "pDrive",
    name: "Night Drive",
    stat: "120 BPM . 4 on the floor",
    body: "Endless arpeggios and gated reverb, mixed to feel like 2 a.m. on an empty highway.",
  },
  {
    id: "pMix",
    name: "Mixtape Maker",
    stat: "C-90 . unlimited",
    body: "Drag tracks onto a virtual cassette, flip the side and share it with a link.",
  },
  {
    id: "pCrew",
    name: "Cruise Crew",
    stat: "up to 8 per car",
    body: "Pick your car, join a crew and sync the same playlist across the whole convoy.",
  },
];

const TAPES: TapeData[] = [
  {
    id: "tCoast",
    name: "Coast",
    price: "Free",
    blurb: "1 car . 20 tracks . ad breaks",
    cta: "Start cruising",
  },
  {
    id: "tTurbo",
    name: "Turbo",
    price: "$9 / mo",
    blurb: "3 cars . full catalogue . no ads",
    cta: "Go turbo",
  },
  {
    id: "tChrome",
    name: "Chrome",
    price: "$19 / mo",
    blurb: "8 seat crew . stems . live sessions",
    cta: "Go chrome",
  },
];

const FAQS = [
  {
    id: "q1",
    question: "Can I upload my own tracks?",
    answer: "Yes. Drop in WAV or MP3 and the mixtape gets a cassette label.",
  },
  {
    id: "q2",
    question: "Does it work on a tiny screen?",
    answer: "Everything stacks into one column and the sunset stays put.",
  },
  {
    id: "q3",
    question: "Is there a retro mode?",
    answer: "It is the only mode. Scanlines are on by default.",
  },
];

const SKY_STEPS = ["sun1", "sun2", "sun3", "sun4"];
const EQ_RESET: ChainOp[] = [
  { clear: "eq1" },
  { clear: "eq2" },
  { clear: "eq3" },
];

const TOAST_SUNSET = "The sun is down. Let's drive.";

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
  );
}

export function HomeScreen({ initialAnnual }: { initialAnnual: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const isXs = useBreakpoint();
  const { flags, clear, toggle, run } = useFlags();
  const [annual, setAnnual] = useState(initialAnnual);
  const [tourOpen, setTourOpen] = useState(false);

  const goSignup = useCallback(() => router.push("/signup"), [router]);
  const goLogin = useCallback(() => router.push("/login"), [router]);
  const closeTour = useCallback(() => setTourOpen(false), []);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        for (const key of ["menu", "q1", "q2", "q3", "going"]) clear(key);
        return;
      }
      if (
        event.key === "c" &&
        !tourOpen &&
        !event.defaultPrevented &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !isTypingTarget(event.target)
      ) {
        goSignup();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [clear, goSignup, tourOpen]);

  const toggleAnnual = () => {
    const next = !annual;
    setAnnual(next);
    const url = new URL(window.location.href);
    url.searchParams.set("billing", String(next));
    window.history.replaceState(null, "", url);
  };

  useEffect(() => {
    const onPopState = () => {
      const billing = new URL(window.location.href).searchParams.get("billing");
      setAnnual(billing === "true");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const playSunset = () =>
    run("sunset", [
      ...SKY_STEPS.map((key) => ({ clear: key })),
      { set: "going" },
      { set: "sun1" },
      { wait: 500 },
      { clear: "sun1" },
      { set: "sun2" },
      { wait: 500 },
      { clear: "sun2" },
      { set: "sun3" },
      { wait: 500 },
      { clear: "sun3" },
      { set: "sun4" },
      { wait: 700 },
      { call: () => toast(TOAST_SUNSET) },
      { clear: "going" },
    ]);

  const insertCoin = () => {
    const blink: ChainOp[] = [
      { set: "blink" },
      { wait: 300 },
      { clear: "blink" },
      { wait: 300 },
    ];
    run("coin", [
      { clear: "blink" },
      ...blink,
      ...blink,
      ...blink,
      { call: goSignup },
    ]);
  };

  const wakeEq = () =>
    run("eq", [
      ...EQ_RESET,
      { set: "eq1" },
      { wait: 250 },
      { clear: "eq1" },
      { set: "eq2" },
      { wait: 250 },
      { clear: "eq2" },
      { set: "eq3" },
      { wait: 250 },
      { clear: "eq3" },
      { set: "eq1" },
      { wait: 250 },
      { clear: "eq1" },
      { set: "eq3" },
      { wait: 250 },
      { clear: "eq3" },
    ]);

  const glitchTitle = () =>
    run("glitch", [
      { set: "glitch" },
      { wait: 120 },
      { clear: "glitch" },
      { wait: 90 },
      { set: "glitch" },
      { wait: 120 },
      { clear: "glitch" },
    ]);

  const onHeroKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && event.target === event.currentTarget) {
      goSignup();
    }
  };

  const showMenu = isXs && flags.menu;

  return (
    <div data-testid="home" className="flex flex-1 flex-col">
      <span
        aria-hidden="true"
        data-testid="home.kEsc"
        className="sr-only"
      />
      <span
        aria-hidden="true"
        data-testid="home.kCoin"
        className="sr-only"
      />
      <div
        data-testid="home.page"
        className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 sm:p-8"
      >
        <div className="relative">
          <nav
            data-testid="home.nav"
            aria-label="Main"
            className="flex items-center gap-4 sm:gap-6"
          >
            <span data-testid="home.wordmark">
              <Wordmark className="text-sm sm:text-lg" />
            </span>
            {!isXs && (
              <>
                <TextButton testId="home.navCars" onClick={() => toast("The Ride")}>
                  The Ride
                </TextButton>
                <TextButton testId="home.navTape" onClick={() => toast("Mixtape")}>
                  Mixtape
                </TextButton>
                <TextButton testId="home.navPass" onClick={() => toast("Pass")}>
                  Pass
                </TextButton>
                <TextButton testId="home.navFaq" onClick={() => toast("FAQ")}>
                  FAQ
                </TextButton>
              </>
            )}
            <Spacer testId="home.navPush" />
            {!isXs && (
              <>
                <Link
                  href="/login"
                  data-testid="home.navLogin"
                  className="text-muted-foreground hover:text-accent"
                >
                  Log in
                </Link>
                <Button
                  testId="home.navCoin"
                  variant="primary"
                  onClick={goSignup}
                >
                  Insert coin
                </Button>
              </>
            )}
            {isXs && (
              <Button
                testId="home.burger"
                variant="ghost"
                aria-expanded={showMenu}
                aria-controls="home-nav-menu"
                onClick={() => toggle("menu")}
              >
                = menu
              </Button>
            )}
          </nav>
          {showMenu && (
            <div
              id="home-nav-menu"
              data-testid="home.navMenu"
              role="group"
              aria-label="Menu"
              className="absolute right-0 top-full z-20 mt-2 flex w-[26ch] flex-col items-start gap-3 border-2 border-border bg-muted p-4 shadow-[0_0_18px_var(--border)]"
            >
              <TextButton testId="home.mRide" onClick={() => clear("menu")}>
                The Ride
              </TextButton>
              <TextButton testId="home.mTape" onClick={() => clear("menu")}>
                Mixtape
              </TextButton>
              <Link
                href="/login"
                data-testid="home.mLogin"
                className="text-muted-foreground hover:text-accent"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                data-testid="home.mCoin"
                className="text-muted-foreground hover:text-accent"
              >
                Insert coin
              </Link>
            </div>
          )}
        </div>
        <Divider testId="home.navRule" />

        <section
          data-testid="home.hero"
          aria-label="Hero"
          tabIndex={0}
          onKeyDown={onHeroKeyDown}
          className="flex flex-col gap-4 outline-offset-4 focus-visible:outline-2 focus-visible:outline-border"
        >
          <p
            data-testid="home.heroTag"
            className="w-fit border-2 border-border px-2 text-muted-foreground"
          >
            == SIDE A . 1990 . STEREO ==
          </p>
          {flags.glitch ? (
            <Title
              testId="home.heroTitleGlitch"
              as="h1"
              className="text-3xl text-accent sm:text-5xl"
            >
              R1DE 1NT0 TH3 N30N H0R1Z0N
            </Title>
          ) : (
            <Title
              testId="home.heroTitle"
              as="h1"
              className="text-3xl text-accent sm:text-5xl"
            >
              <span
                onMouseEnter={glitchTitle}
                style={{ textShadow: "0 0 14px var(--accent)" }}
              >
                RIDE INTO THE NEON HORIZON
              </span>
            </Title>
          )}
          <p data-testid="home.heroBody" className="max-w-2xl">
            A late night drive, a drum machine and a sky that never turns off.
            NEON DRIVE is the 90s synth tape you can join from your browser:
            stream, remix and cruise with a crew.
          </p>
          <div data-testid="home.heroActions" className="flex items-center gap-3">
            <Button testId="home.heroPlay" variant="primary" onClick={playSunset}>
              Press play
            </Button>
            <Button testId="home.heroTour" onClick={() => setTourOpen(true)}>
              Watch the tour
            </Button>
            <Spacer testId="home.heroPush" />
          </div>
          {flags.going && (
            <Spinner testId="home.goingSpin" label="Tuning the radio" />
          )}
          <Panel testId="home.sky" label="Sunset">
            <div className="overflow-x-auto whitespace-pre text-muted-foreground">
              {!flags.sun1 && (
                <div data-testid="home.skyBase">
                  {"      . * .        *        .   *      ."}
                </div>
              )}
              {flags.sun1 && (
                <div data-testid="home.skyS1">
                  {"   _______________________________"}
                </div>
              )}
              {flags.sun2 && (
                <div data-testid="home.skyS2">
                  {"  /  ///////  ===  ///////  ===   \\\\"}
                </div>
              )}
              {flags.sun3 && (
                <div data-testid="home.skyS3">
                  {"  ========= sun slips under ========"}
                </div>
              )}
              {flags.sun4 && (
                <div data-testid="home.skyS4" className="text-accent">
                  {"  ~~~~~ lights out, grid lights up ~~~~~"}
                </div>
              )}
              {!flags.sun3 && (
                <div data-testid="home.skySun" className="text-accent">
                  {"        ( ( (  O  ) ) )"}
                </div>
              )}
              <div data-testid="home.skyHorizon">
                {"  ------ horizon ------------------------"}
              </div>
              <div data-testid="home.skyGrid1">
                {"   /  /  /  |  |  |  \\\\  \\\\  \\\\"}
              </div>
              <div data-testid="home.skyGrid2">
                {"  /  /  /   |  |  |   \\\\  \\\\  \\\\"}
              </div>
              <div data-testid="home.skyGrid3">
                {" ______________________________"}
              </div>
            </div>
          </Panel>
          <p data-testid="home.heroProof" className="text-muted-foreground">
            Cruising now: Miami . Tokyo . Los Angeles . Berlin
          </p>
        </section>
        <Divider testId="home.heroRule" />

        <div data-testid="home.coinRow" className="flex items-center gap-4">
          <Spacer testId="home.coinL" />
          <Button testId="home.coinBlink" variant="primary" onClick={insertCoin}>
            INSERT COIN
          </Button>
          {flags.blink ? (
            <p data-testid="home.coinOn" className="whitespace-pre text-accent">
              {">> 1 PLAYER READY <<"}
            </p>
          ) : (
            <p
              data-testid="home.coinOff"
              className="whitespace-pre text-muted-foreground"
            >
              {"   1 PLAYER READY   "}
            </p>
          )}
          <Spacer testId="home.coinR" />
        </div>
        <Divider testId="home.coinRule" />

        <Title testId="home.perkTitle" className="text-2xl">
          THE SOUND OF THE DECADE
        </Title>
        <div
          data-testid="home.perks"
          className="flex flex-col gap-4 sm:flex-row"
        >
          {PERKS.map((perk) => (
            <Perk key={perk.id} {...perk} />
          ))}
        </div>
        <Divider testId="home.perkRule" />

        <div data-testid="home.eqHead" className="flex items-center gap-4">
          <Title testId="home.eqTitle" className="text-2xl">
            LIVE FROM THE GRID
          </Title>
          <Spacer testId="home.eqPush" />
          <Button testId="home.eqGo" variant="ghost" onClick={wakeEq}>
            Wake the EQ
          </Button>
        </div>
        <Panel testId="home.eq" label="Spectrum">
          <div className="flex flex-col gap-3">
            <div className="whitespace-pre text-accent">
              {!flags.eq1 && (
                <div data-testid="home.eqIdle">{"|  |  |  |  |  |  |  |"}</div>
              )}
              {flags.eq1 && (
                <div data-testid="home.eqF1">{"|# |##|# |  |##|# |  |#"}</div>
              )}
              {flags.eq2 && (
                <div data-testid="home.eqF2">{"|##|# |##|# |# |##|# |##"}</div>
              )}
              {flags.eq3 && (
                <div data-testid="home.eqF3">{"|# |##|##|##|  |# |##|#"}</div>
              )}
            </div>
            <Progress testId="home.eqLevel" label="Master volume" value={70} />
          </div>
        </Panel>
        <Divider testId="home.eqRule" />

        <div data-testid="home.stats" className="flex flex-col gap-4 sm:flex-row">
          <Stat
            testId="home.sTracks"
            label="Tracks on the tape"
            value="1,990"
            delta="+90"
            caption="added this month"
          />
          <Stat
            testId="home.sCars"
            label="Cars on the road"
            value="48,000"
            delta="+12%"
            caption="vs last month"
          />
          <Stat
            testId="home.sMiles"
            label="Neon miles driven"
            value="9.9M"
            trend="up"
            hint="since launch"
          />
        </div>
        <Divider testId="home.statRule" />

        <div data-testid="home.passHead" className="flex items-center gap-4">
          <Title testId="home.passTitle" className="text-2xl">
            CHOOSE YOUR TAPE
          </Title>
          <Spacer testId="home.passPush" />
          <button
            type="button"
            role="switch"
            aria-checked={annual}
            data-testid="home.annual"
            onClick={toggleAnnual}
            className="flex cursor-pointer items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            <span
              aria-hidden="true"
              className={`flex h-6 w-11 items-center border-2 border-border px-0.5 ${
                annual ? "justify-end bg-accent" : "justify-start bg-muted"
              }`}
            >
              <span className="block size-4 bg-foreground" />
            </span>
            <span>Annual pass, save 20%</span>
          </button>
        </div>
        <div data-testid="home.tapes" className="flex flex-col gap-4 sm:flex-row">
          {TAPES.map((tape) => (
            <Tape key={tape.id} {...tape} onBuy={goSignup} />
          ))}
        </div>
        <Divider testId="home.tapeRule" />

        <Title testId="home.faqTitle" className="text-2xl">
          ASK THE DJ
        </Title>
        <div data-testid="home.faq" className="flex flex-col">
          {FAQS.map(({ id, question, answer }) => {
            const open = Boolean(flags[id]);
            return (
              <div key={id} className="flex flex-col">
                <TextButton
                  testId={`home.${id}${open ? "shut" : "open"}`}
                  aria-expanded={open}
                  className="py-1"
                  onClick={() => toggle(id)}
                >
                  {open ? "-" : "+"} {question}
                </TextButton>
                {open && (
                  <div data-testid={`home.${id}body`} className="p-3">
                    <p data-testid={`home.${id}answer`}>{answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <Divider testId="home.faqRule" />

        <Panel testId="home.cta" label="READY PLAYER ONE">
          <div className="flex flex-col gap-4">
            <p data-testid="home.ctaBody">Grab the wheel. First tape is on us.</p>
            <div data-testid="home.ctaActions" className="flex items-center gap-3">
              <Button testId="home.ctaGo" variant="primary" onClick={goSignup}>
                Insert coin
              </Button>
              <Button testId="home.ctaLogin" onClick={goLogin}>
                I have a pass
              </Button>
              <Spacer testId="home.ctaPush" />
            </div>
          </div>
        </Panel>
        <Divider testId="home.ctaRule" />

        <footer
          data-testid="home.foot"
          className="flex flex-wrap items-center gap-4 text-muted-foreground"
        >
          <span data-testid="home.footLegal">NEON DRIVE . est. 1990</span>
          <Spacer testId="home.footPush" />
          <TextButton testId="home.footPrivacy" onClick={() => toast("Privacy")}>
            Privacy
          </TextButton>
          <TextButton testId="home.footTerms" onClick={() => toast("Terms")}>
            Terms
          </TextButton>
          <span data-testid="home.footMail">hello@neondrive.example</span>
        </footer>
      </div>
      {tourOpen && <TourModal onClose={closeTour} onSignup={goSignup} />}
    </div>
  );
}

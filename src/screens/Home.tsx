import type { ReactNode } from "react";
import { DIFFICULTY_CONFIG, DIFF_ORDER, DiffKey, Mode, ROUNDS_PER_GAME } from "../engine/types";
import { CLUB_POOLS, dbStats, NATIONAL_TEAM_POOLS, questionPools } from "../engine/engine";
import { ArrowIcon, BallIcon, DifficultyBadge, GameButton, getBest, sfx, TrophyIcon } from "../ui/Chrome";

const MODES: { key: Mode; n: string; title: string; desc: string }[] = [
  {
    key: "quiz", n: "01", title: "FOOTBALL QUIZ",
    desc: "Multiple-choice questions across players, clubs, national teams, World Cups, Champions League, records and history.",
  },
  {
    key: "national", n: "02", title: "GUESS THE NATIONAL TEAM",
    desc: "3–5 players who genuinely represented the same country. Pick the right national team from four game-style crests.",
  },
  {
    key: "club", n: "03", title: "GUESS THE CLUB",
    desc: "3–5 players who genuinely played for the same club. Pick the right badge from four crests — then see the full reveal.",
  },
];

function ModeIcon({ mode }: { mode: Mode }) {
  if (mode === "quiz") {
    return (
      <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
        <rect x="8" y="4" width="28" height="36" rx="4" fill="#f4f8ff" stroke="#0b1c3a" strokeWidth="2.4" />
        <rect x="15" y="1" width="14" height="7" rx="2.5" fill="#ffd257" stroke="#0b1c3a" strokeWidth="2" />
        <path d="M14 17 h16 M14 24 h16 M14 31 h9" stroke="#0b1c3a" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="31" cy="31" r="4.6" fill="#17c964" stroke="#0b1c3a" strokeWidth="2" />
        <path d="M29 31 l1.6 1.6 2.8-3" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (mode === "national") {
    return (
      <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
        <circle cx="22" cy="22" r="17" fill="#2757a8" stroke="#0b1c3a" strokeWidth="2.4" />
        <path d="M5 22 H39 M22 5 C14 12 14 32 22 39 M22 5 C30 12 30 32 22 39 M7.5 14 H36.5 M7.5 30 H36.5" stroke="#8fb8ee" strokeWidth="1.8" fill="none" />
        <circle cx="22" cy="22" r="17" fill="none" stroke="#ffd257" strokeWidth="1" opacity="0.8" />
      </svg>
    );
  }
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
      <path d="M22 3 L38 8 V22 C38 33 31 40 22 43 C13 40 6 33 6 22 V8 Z" fill="#c8102e" stroke="#0b1c3a" strokeWidth="2.4" />
      <path d="M22 3 L38 8 V22 C38 33 31 40 22 43 Z" fill="#8f0d20" />
      <circle cx="22" cy="21" r="7" fill="#f4f8ff" stroke="#0b1c3a" strokeWidth="2" />
      <path d="M22 17.8 L25 20 L23.9 23.6 L20.1 23.6 L19 20 Z" fill="#0b1c3a" />
      <path d="M14 33 H30" stroke="#ffd257" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function MenuScreen({ onMode, onHowTo }: { onMode: (m: Mode) => void; onHowTo: () => void }) {
  const stats = dbStats();
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:py-12">
      {/* logo block */}
      <header className="anim-rise text-center">
        <div className="mb-3 flex items-center justify-center gap-3">
          <span className="anim-spin-slow inline-block"><BallIcon size={34} /></span>
          <span className="display rounded bg-pitch-700/80 px-3 py-1 text-xs tracking-[0.3em] text-ink-dim border border-pitch-line/25">
            SEASON 2026 • KICK-OFF
          </span>
          <span className="anim-spin-slow inline-block" style={{ animationDirection: "reverse" }}><BallIcon size={34} /></span>
        </div>
        <h1 className="display text-outline leading-[0.9]">
          <span className="block text-5xl font-bold tracking-wide text-white md:text-7xl">MATCHDAY</span>
          <span className="block text-4xl font-semibold tracking-[0.35em] text-gold-400 md:text-6xl" style={{ color: "var(--color-gold-400)" }}>
            LEGENDS
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-ink-dim md:text-lg">
          The nostalgic football video-game quiz. Three modes. Five dedicated difficulty pools.
          One very long final whistle.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* mode cards */}
        <nav className="flex flex-col gap-4">
          {MODES.map((m, i) => (
            <button
              key={m.key}
              onClick={() => { sfx.click(); onMode(m.key); }}
              className="mode-card glossy group flex items-center gap-4 rounded-xl px-5 py-5 text-left md:px-7 md:py-6 anim-rise"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span className="display hidden text-3xl font-bold text-pitch-line/40 md:block">{m.n}</span>
              <span className="shrink-0 rounded-lg bg-pitch-900/70 p-3 border border-pitch-line/20"><ModeIcon mode={m.key} /></span>
              <span className="min-w-0 flex-1">
                <span className="display block text-xl font-semibold tracking-wide text-white md:text-2xl">{m.title}</span>
                <span className="mt-1 block text-sm leading-snug text-ink-dim">{m.desc}</span>
              </span>
              <span className="text-gold-400 transition-transform duration-200 group-hover:translate-x-1.5" style={{ color: "var(--color-gold-400)" }}>
                <ArrowIcon dir="right" size={26} />
              </span>
            </button>
          ))}
          <button
            onClick={() => { sfx.click(); onHowTo(); }}
            className="mode-card plate flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 anim-rise"
            style={{ animationDelay: "280ms" }}
          >
            <TrophyIcon size={18} />
            <span className="display text-sm tracking-[0.2em] text-ink">HOW TO PLAY</span>
          </button>
        </nav>

        {/* side panel */}
        <aside className="glossy-deep rounded-xl p-5 anim-rise" style={{ animationDelay: "180ms" }}>
          <h2 className="display mb-4 text-sm tracking-[0.25em] text-gold-400" style={{ color: "var(--color-gold-400)" }}>
            CLUB DATABASE
          </h2>
          <dl className="flex flex-col gap-3">
            {[
              ["PLAYERS", stats.players.toLocaleString()],
              ["NATIONAL TEAMS", stats.nationalTeams.toLocaleString()],
              ["CLUBS", stats.clubs.toLocaleString()],
              ["QUESTIONS", `${stats.questions.toLocaleString()}+`],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between border-b border-pitch-line/15 pb-2">
                <dt className="display text-[11px] tracking-[0.18em] text-ink-dim">{k}</dt>
                <dd className="display text-2xl font-semibold text-white">{v}</dd>
              </div>
            ))}
          </dl>
          <h2 className="display mb-2 mt-6 text-sm tracking-[0.25em] text-gold-400" style={{ color: "var(--color-gold-400)" }}>
            DIFFICULTY LADDER
          </h2>
          <ul className="flex flex-col gap-1.5">
            {DIFF_ORDER.map((d) => (
              <li key={d} className="flex items-center justify-between">
                <DifficultyBadge diff={d} small />
                <span className="text-xs text-ink-dim">{questionPools[d].length} Qs • {DIFFICULTY_CONFIG[d].points} pts</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-ink-dim">
            Every difficulty has its own dedicated question pool — the game never relabels an easy
            question as impossible. {ROUNDS_PER_GAME} rounds per match.
          </p>
        </aside>
      </div>

      <footer className="text-center text-xs tracking-widest text-ink-dim/70">
        ORIGINAL GAME-STYLE CRESTS &amp; PORTRAITS • NO OFFICIAL LOGOS • BUILT FOR FOOTBALL NERDS
      </footer>
    </div>
  );
}

export function DifficultyScreen({
  mode, onPick, onBack,
}: { mode: Mode; onPick: (d: DiffKey | "random") => void; onBack: () => void }) {
  const modeTitle = MODES.find((m) => m.key === mode)?.title || "";
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:py-12">
      <button onClick={() => { sfx.click(); onBack(); }} className="mb-6 flex items-center gap-2 text-sm text-ink-dim transition-colors hover:text-white">
        <ArrowIcon size={16} /> <span className="display tracking-[0.2em]">MAIN MENU</span>
      </button>
      <header className="anim-rise mb-8 text-center">
        <span className="display rounded bg-pitch-700/80 border border-pitch-line/25 px-3 py-1 text-[11px] tracking-[0.25em] text-ink-dim">{modeTitle}</span>
        <h1 className="display text-outline mt-3 text-4xl font-bold tracking-wide text-white md:text-5xl">SELECT DIFFICULTY</h1>
        <p className="mt-2 text-ink-dim">Each level draws from its own dedicated question pool.</p>
      </header>
      <div className="flex flex-col gap-3">
        {DIFF_ORDER.map((d, i) => {
          const meta = DIFFICULTY_CONFIG[d];
          return (
            <button
              key={d}
              onClick={() => { sfx.click(); onPick(d); }}
              className="mode-card glossy flex items-center gap-4 rounded-xl px-5 py-4 text-left anim-rise"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span className="h-14 w-2 rounded-full" style={{ background: meta.color, boxShadow: `0 0 14px ${meta.color}66` }} />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="display text-xl font-semibold tracking-wide text-white md:text-2xl">{meta.label}</span>
                  <span className="display rounded bg-pitch-900/80 px-2 py-0.5 text-[11px] text-gold-400" style={{ color: "var(--color-gold-400)" }}>
                    {meta.points} PTS / ANSWER
                  </span>
                </span>
                <span className="mt-0.5 block text-sm text-ink-dim">
                  {meta.tagline} •{" "}
                  {mode === "quiz"
                    ? `${questionPools[d].length} questions in dedicated pool`
                    : mode === "national"
                      ? `${NATIONAL_TEAM_POOLS[d].length} national teams in dedicated pool`
                      : `${CLUB_POOLS[d].length} clubs in dedicated pool`}
                  {getBest(mode, d) > 0 && (
                    <span className="display ml-2 rounded bg-pitch-900/80 px-1.5 py-0.5 text-[10px] tracking-wider text-gold-300" style={{ color: "var(--color-gold-300)" }}>
                      ★ BEST {getBest(mode, d).toLocaleString()}
                    </span>
                  )}
                </span>
              </span>
              <span style={{ color: meta.color }}><ArrowIcon dir="right" size={24} /></span>
            </button>
          );
        })}
        <button
          onClick={() => { sfx.click(); onPick("random"); }}
          className="mode-card glossy anim-glow flex items-center gap-4 rounded-xl px-5 py-4 text-left anim-rise"
          style={{ animationDelay: "360ms", borderColor: "rgba(255,210,87,0.5)" }}
        >
          <span className="h-14 w-2 rounded-full bg-gold-400" style={{ background: "var(--color-gold-400)" }} />
          <span className="min-w-0 flex-1">
            <span className="display text-xl font-semibold tracking-wide text-gold-300 md:text-2xl" style={{ color: "var(--color-gold-300)" }}>
              RANDOM DIFFICULTY
            </span>
            <span className="mt-0.5 block text-sm text-ink-dim">
              A fresh difficulty is rolled before every round — then that level's pool is used. Chaos, but fair chaos.
            </span>
          </span>
          <span className="anim-float"><BallIcon size={26} /></span>
        </button>
      </div>
    </div>
  );
}

export function HowToScreen({ onBack }: { onBack: () => void }) {
  const S = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className="glossy rounded-xl p-5 md:p-6">
      <h2 className="display mb-3 text-lg font-semibold tracking-wide text-gold-400" style={{ color: "var(--color-gold-400)" }}>{title}</h2>
      <div className="text-sm leading-relaxed text-ink-dim">{children}</div>
    </section>
  );
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:py-12">
      <button onClick={() => { sfx.click(); onBack(); }} className="mb-6 flex items-center gap-2 text-sm text-ink-dim transition-colors hover:text-white">
        <ArrowIcon size={16} /> <span className="display tracking-[0.2em]">MAIN MENU</span>
      </button>
      <h1 className="display text-outline anim-rise mb-8 text-center text-4xl font-bold tracking-wide text-white md:text-5xl">HOW TO PLAY</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <S title="THE THREE MODES">
          <p><strong className="text-white">Football Quiz</strong> — four options, one truth. Categories: Players, Clubs, National Teams, World Cup, Champions League, Records, History.</p>
          <p className="mt-2"><strong className="text-white">Guess the National Team</strong> — 3–5 real internationals of one country. Pick the country from four original crests.</p>
          <p className="mt-2"><strong className="text-white">Guess the Club</strong> — same idea, but the players share one club badge.</p>
        </S>
        <S title="THE REVEAL">
          <p>After every answer you see <strong className="text-white">CORRECT!</strong> or <strong className="text-white">INCORRECT!</strong>, the right crest, every player portrait with names, and an explanation. The reveal happens even when you get it wrong — that's the lesson.</p>
        </S>
        <S title="FIVE REAL DIFFICULTIES">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {DIFF_ORDER.map((d) => <DifficultyBadge key={d} diff={d} small />)}
          </div>
          <p>EASY is for casual fans; IMPOSSIBLE digs into 1960s Ballon d'Or winners and 1930s World Cup hat-tricks. Each level has a <strong className="text-white">separate pool</strong> — a question never jumps levels.</p>
        </S>
        <S title="SCORING & STREAKS">
          <p>Easy 100 • Medium 200 • Hard 300 • Extreme Hard 500 • Impossible 1000 points per correct answer. Consecutive correct answers build a <strong className="text-white">streak</strong> — keep the flame alive for {ROUNDS_PER_GAME} rounds.</p>
        </S>
        <S title="RANDOMIZATION">
          <p>Every restart shuffles questions, answer order, players, crests and challenge order. Recently used questions and challenges are set aside, so nothing repeats back-to-back while unused material remains. <strong className="text-white">Random Difficulty</strong> rolls a level first, then uses that level's pool — never the other way around.</p>
        </S>
        <S title="VALIDITY GUARANTEE">
          <p>Guess challenges are generated from a verified database of 1,000+ players and validated before display: every shown player genuinely represented the nation or played for the club. No invented facts, ever.</p>
        </S>
      </div>
      <div className="mt-6 text-center">
        <GameButton color="#0aa05b" size="md" onClick={() => { sfx.click(); onBack(); }}>
          BACK TO KICK-OFF
        </GameButton>
      </div>
    </div>
  );
}

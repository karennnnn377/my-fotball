import { DIFFICULTY_CONFIG, DIFF_ORDER, DiffKey, Mode, ROUNDS_PER_GAME } from "../engine/types";
import { CLUB_POOLS, dbStats, NATIONAL_TEAM_POOLS, questionPools } from "../engine/engine";
import { LangSwitch, Rich, useI18n } from "../i18n";
import { ArrowIcon, BallIcon, DifficultyBadge, GameButton, getBest, MuteToggle, sfx, TrophyIcon } from "../ui/Chrome";

const MODE_KEYS: Mode[] = ["quiz", "national", "club"];

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
  const { t } = useI18n();
  const stats = dbStats();
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:gap-8 md:py-12">
      {/* language + season bar */}
      <div className="flex items-center justify-between gap-3 anim-rise">
        <span className="display rounded bg-pitch-700/80 px-3 py-1 text-[11px] tracking-[0.3em] text-ink-dim border border-pitch-line/25">
          {t.season}
        </span>
        <LangSwitch />
      </div>

      {/* logo block — the brand stays Latin, the voice is yours */}
      <header className="anim-rise text-center">
        <div className="mb-3 flex items-center justify-center gap-3">
          <span className="anim-spin-slow inline-block"><BallIcon size={34} /></span>
          <h1 className="display text-outline leading-[0.95]">
            <span className="block text-5xl font-bold tracking-wide text-white md:text-7xl">MATCHDAY</span>
            <span className="block text-4xl font-semibold tracking-[0.35em] text-gold-400 md:text-6xl" style={{ color: "var(--color-gold-400)" }}>
              LEGENDS
            </span>
          </h1>
          <span className="anim-spin-slow inline-block" style={{ animationDirection: "reverse" }}><BallIcon size={34} /></span>
        </div>
        <p className="mx-auto mt-4 max-w-xl text-base text-ink-dim md:text-lg">{t.tagline}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* mode cards */}
        <nav className="flex flex-col gap-4">
          {MODE_KEYS.map((key, i) => {
            const m = t.modes[key];
            return (
              <button
                key={key}
                onClick={() => { sfx.click(); onMode(key); }}
                className="mode-card glossy group flex items-center gap-4 rounded-xl px-5 py-5 text-left md:px-7 md:py-6 anim-rise"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <span className="display hidden text-3xl font-bold text-pitch-line/40 md:block">{String(i + 1).padStart(2, "0")}</span>
                <span className="shrink-0 rounded-lg bg-pitch-900/70 p-3 border border-pitch-line/20"><ModeIcon mode={key} /></span>
                <span className="min-w-0 flex-1">
                  <span className="display block text-xl font-semibold tracking-wide text-white md:text-2xl">{m.title}</span>
                  <span className="mt-1 block text-sm leading-snug text-ink-dim">{m.desc}</span>
                </span>
                <span className="text-gold-400 transition-transform duration-200 group-hover:scale-125" style={{ color: "var(--color-gold-400)" }}>
                  <ArrowIcon dir="right" size={26} />
                </span>
              </button>
            );
          })}
          <button
            onClick={() => { sfx.click(); onHowTo(); }}
            className="mode-card plate flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 anim-rise"
            style={{ animationDelay: "280ms" }}
          >
            <TrophyIcon size={18} />
            <span className="display text-sm tracking-[0.2em] text-ink">{t.howToPlay}</span>
          </button>
        </nav>

        {/* side panel */}
        <aside className="glossy-deep h-fit rounded-xl p-5 anim-rise" style={{ animationDelay: "180ms" }}>
          <h2 className="display mb-4 text-sm tracking-[0.25em] text-gold-400" style={{ color: "var(--color-gold-400)" }}>
            {t.dbTitle}
          </h2>
          <dl className="flex flex-col gap-3">
            {[
              [t.dbPlayers, t.n(stats.players)],
              [t.dbTeams, t.n(stats.nationalTeams)],
              [t.dbClubs, t.n(stats.clubs)],
              [t.dbQuestions, `${t.n(stats.questions)}+`],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between border-b border-pitch-line/15 pb-2">
                <dt className="display text-[11px] tracking-[0.18em] text-ink-dim">{k}</dt>
                <dd className="display text-2xl font-semibold text-white">{v}</dd>
              </div>
            ))}
          </dl>
          <h2 className="display mb-2 mt-6 text-sm tracking-[0.25em] text-gold-400" style={{ color: "var(--color-gold-400)" }}>
            {t.ladder}
          </h2>
          <ul className="flex flex-col gap-1.5">
            {DIFF_ORDER.map((d) => (
              <li key={d} className="flex items-center justify-between gap-2">
                <DifficultyBadge diff={d} small />
                <span className="text-xs text-ink-dim">{t.n(questionPools[d].length)} {t.qsShort} • {t.n(DIFFICULTY_CONFIG[d].points)} {t.ptsShort}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-ink-dim">{t.poolNote(ROUNDS_PER_GAME)}</p>
        </aside>
      </div>

      {/* live ticker — the lobby never sleeps */}
      <div className="ticker-wrap anim-rise rounded-lg border border-pitch-line/20 bg-pitch-900/70 py-2.5" style={{ animationDelay: "340ms" }}>
        <div className="ticker">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              {t.ticker(stats).map((txt, i) => (
                <span key={i} className="display flex items-center whitespace-nowrap text-[11px] tracking-[0.18em] text-ink-dim">
                  <span className="mx-4 inline-block opacity-70"><BallIcon size={13} /></span>
                  {txt}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <footer className="flex flex-col items-center justify-center gap-3 text-center text-xs tracking-widest text-ink-dim/70 sm:flex-row sm:justify-between">
        <span>{t.footerLine}</span>
        <MuteToggle />
      </footer>
    </div>
  );
}

export function DifficultyScreen({
  mode, onPick, onBack,
}: { mode: Mode; onPick: (d: DiffKey | "random") => void; onBack: () => void }) {
  const { t } = useI18n();
  const modeTitle = t.modes[mode].title;
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 md:py-12">
      <div className="mb-6 flex items-center justify-between gap-3">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-2 text-sm text-ink-dim transition-colors hover:text-white">
          <ArrowIcon size={16} /> <span className="display tracking-[0.2em]">{t.mainMenu}</span>
        </button>
        <LangSwitch />
      </div>
      <header className="anim-rise mb-8 text-center">
        <span className="display rounded bg-pitch-700/80 border border-pitch-line/25 px-3 py-1 text-[11px] tracking-[0.25em] text-ink-dim">{modeTitle}</span>
        <h1 className="display text-outline mt-3 text-4xl font-bold tracking-wide text-white md:text-5xl">{t.selectDifficulty}</h1>
        <p className="mt-2 text-ink-dim">{t.dedicatedLine}</p>
        <p className="mt-1 text-xs text-ink-dim/70">{t.questionsNote}</p>
      </header>
      <div className="flex flex-col gap-3">
        {DIFF_ORDER.map((d, i) => {
          const meta = DIFFICULTY_CONFIG[d];
          const poolCount = mode === "quiz"
            ? t.poolQuiz(questionPools[d].length)
            : mode === "national"
              ? t.poolNational(NATIONAL_TEAM_POOLS[d].length)
              : t.poolClub(CLUB_POOLS[d].length);
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
                  <span className="display text-xl font-semibold tracking-wide text-white md:text-2xl">{t.diff[d].label}</span>
                  <span className="display rounded bg-pitch-900/80 px-2 py-0.5 text-[11px] text-gold-400" style={{ color: "var(--color-gold-400)" }}>
                    {t.n(meta.points)} {t.ptsPerAnswer}
                  </span>
                </span>
                <span className="mt-0.5 block text-sm text-ink-dim">
                  {t.diff[d].tag} • {poolCount}
                  {getBest(mode, d) > 0 && (
                    <span className="display ms-2 rounded bg-pitch-900/80 px-1.5 py-0.5 text-[10px] tracking-wider text-gold-300" style={{ color: "var(--color-gold-300)" }}>
                      {t.best(getBest(mode, d))}
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
              {t.randomLabel}
            </span>
            <span className="mt-0.5 block text-sm text-ink-dim">{t.randomDesc}</span>
          </span>
          <span className="anim-float"><BallIcon size={26} /></span>
        </button>
      </div>
      <p dir="ltr" className="display mt-6 text-center text-[10px] tracking-[0.2em] text-ink-dim/60">
        EASY → MEDIUM → HARD → EXTREME HARD → IMPOSSIBLE
      </p>
    </div>
  );
}

export function HowToScreen({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 md:py-12">
      <div className="mb-6 flex items-center justify-between gap-3">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-2 text-sm text-ink-dim transition-colors hover:text-white">
          <ArrowIcon size={16} /> <span className="display tracking-[0.2em]">{t.mainMenu}</span>
        </button>
        <LangSwitch />
      </div>
      <h1 className="display text-outline anim-rise mb-8 text-center text-4xl font-bold tracking-wide text-white md:text-5xl">{t.howtoTitle}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {t.howto.map((s, i) => (
          <section key={s.title} className="glossy rounded-xl p-5 md:p-6 anim-rise" style={{ animationDelay: `${i * 60}ms` }}>
            <h2 className="display mb-3 text-lg font-semibold tracking-wide text-gold-400" style={{ color: "var(--color-gold-400)" }}>{s.title}</h2>
            <div className="text-sm leading-relaxed text-ink-dim">
              {i === 2 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {DIFF_ORDER.map((d) => <DifficultyBadge key={d} diff={d} small />)}
                </div>
              )}
              <Rich s={s.body} />
            </div>
          </section>
        ))}
      </div>
      <div className="mt-6 text-center">
        <GameButton color="#0aa05b" size="md" onClick={() => { sfx.click(); onBack(); }}>
          {t.backToKickoff}
        </GameButton>
      </div>
    </div>
  );
}

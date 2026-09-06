import { useId } from "react";
import { DIFFICULTY_CONFIG, DIFF_ORDER, DiffKey, Mode, ROUNDS_PER_GAME } from "../engine/types";
import { CLUB_POOLS, dbStats, NATIONAL_TEAM_POOLS, questionPools } from "../engine/engine";
import { LangSwitch, Rich, useI18n } from "../i18n";
import { ArrowIcon, BallIcon, DifficultyBadge, GameButton, getBest, MuteToggle, sfx, TrophyIcon } from "../ui/Chrome";

const MODE_KEYS: Mode[] = ["quiz", "national", "club"];

/* ============================================================
   KAREN — the developer's portrait, fully hand-drawn SVG.
   A 13-year-old boy: long styled black hair, no beard, big
   friendly eyes, rosy cheeks, and a modern bomber jacket with
   a gold zipper. This is the single source of truth for the
   image shown on the developer card — no hash rolls, no props.
   ============================================================ */
export function KarenAvatar({ size = 150 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  const bg = `kbg${uid}`, skinG = `ksk${uid}`, hairG = `khr${uid}`, jackG = `kjk${uid}`,
    irisG = `kir${uid}`, ringG = `krg${uid}`, vinG = `kvn${uid}`, clipG = `kcp${uid}`;
  const dark = "#0b1c3a";
  return (
    <svg
      width={size} height={size} viewBox="0 0 200 200" role="img"
      aria-label="Karen — designer & programmer, 13, Dubai"
      className="portrait-ring rounded-full"
      style={{ shapeRendering: "geometricPrecision" }}
    >
      <defs>
        <radialGradient id={bg} cx="50%" cy="28%" r="85%">
          <stop offset="0%" stopColor="#33568e" />
          <stop offset="55%" stopColor="#16305c" />
          <stop offset="100%" stopColor="#0a1730" />
        </radialGradient>
        <radialGradient id={skinG} cx="42%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#f9d7b2" />
          <stop offset="55%" stopColor="#edbd93" />
          <stop offset="100%" stopColor="#c9895c" />
        </radialGradient>
        <linearGradient id={hairG} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2b2735" />
          <stop offset="45%" stopColor="#16131c" />
          <stop offset="100%" stopColor="#0c0a10" />
        </linearGradient>
        <linearGradient id={jackG} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4a68" />
          <stop offset="45%" stopColor="#232f49" />
          <stop offset="100%" stopColor="#141d33" />
        </linearGradient>
        <radialGradient id={irisG} cx="38%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#7a5a3a" />
          <stop offset="55%" stopColor="#4a3524" />
          <stop offset="100%" stopColor="#241708" />
        </radialGradient>
        <linearGradient id={ringG} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f9e7a0" />
          <stop offset="45%" stopColor="#caa23f" />
          <stop offset="70%" stopColor="#8a6516" />
          <stop offset="100%" stopColor="#f3d98b" />
        </linearGradient>
        <radialGradient id={vinG} cx="50%" cy="44%" r="62%">
          <stop offset="70%" stopColor="rgba(4,8,22,0)" />
          <stop offset="100%" stopColor="rgba(4,8,22,0.45)" />
        </radialGradient>
        <clipPath id={clipG}><circle cx="100" cy="100" r="97" /></clipPath>
      </defs>

      <g clipPath={`url(#${clipG})`}>
        {/* studio backdrop + spotlight */}
        <rect x="0" y="0" width="200" height="200" fill={`url(#${bg})`} />
        <circle cx="100" cy="68" r="60" fill="#ffffff" opacity="0.06" />

        {/* ===== bomber jacket ===== */}
        <path d="M26 200 C30 154 56 132 80 125 L100 134 L120 125 C144 132 170 154 174 200 Z" fill={`url(#${jackG})`} stroke={dark} strokeWidth="3" />
        <path d="M26 200 C30 162 46 140 62 132 L58 200 Z" fill="#000000" opacity="0.20" />
        <path d="M174 200 C170 162 154 140 138 132 L142 200 Z" fill="#000000" opacity="0.20" />
        {/* sleeve stripes — cream + gold */}
        <path d="M44 142 L71 128 L75 135 L48 149 Z" fill="#f2ede1" opacity="0.92" />
        <path d="M36 151 L63 137 L67 144 L40 158 Z" fill="#ffd257" />
        <path d="M156 142 L129 128 L125 135 L152 149 Z" fill="#f2ede1" opacity="0.92" />
        <path d="M164 151 L137 137 L133 144 L160 158 Z" fill="#ffd257" />
        {/* gold zipper */}
        <line x1="100" y1="136" x2="100" y2="200" stroke="#0d1526" strokeWidth="5" />
        <line x1="100" y1="138" x2="100" y2="200" stroke="#ffd257" strokeWidth="1.6" strokeDasharray="3.5 3" />
        <rect x="97.2" y="147" width="5.6" height="9" rx="2" fill="#ffd257" stroke={dark} strokeWidth="1.4" />
        <circle cx="100" cy="160" r="2.6" fill="#ffd257" stroke={dark} strokeWidth="1.2" />
        {/* stand collar */}
        <path d="M79 123 C88 131 112 131 121 123 L125 131 C112 141 88 141 75 131 Z" fill="#1a2440" stroke={dark} strokeWidth="2" />
        <path d="M80 124.5 C89 132 111 132 120 124.5" fill="none" stroke="#ffd257" strokeWidth="1.6" />
        {/* fabric sheen + rim light */}
        <ellipse cx="80" cy="162" rx="24" ry="30" fill="#ffffff" opacity="0.05" transform="rotate(-16 80 162)" />
        <path d="M142 134 C156 142 166 156 170 176" stroke="rgba(255,255,255,0.20)" strokeWidth="4" fill="none" strokeLinecap="round" />

        {/* ===== long back hair — flows over the shoulders ===== */}
        <path
          d="M62 50 C56 22 82 10 100 10 C118 10 144 22 138 50 C144 78 144 108 137 134 C133 150 136 160 129 168 C121 176 113 171 116 158 C120 140 121 112 117 86 L83 86 C79 112 80 140 84 158 C87 171 79 176 71 168 C64 160 67 150 63 134 C56 108 56 78 62 50 Z"
          fill={`url(#${hairG})`} stroke={dark} strokeWidth="2.5"
        />
        <path d="M69 62 C65 92 65 122 70 150" stroke="#4d5468" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
        <path d="M131 62 C135 92 135 122 130 150" stroke="#4d5468" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
        <path d="M76 55 C73 85 73 118 78 154" stroke="#0c0a10" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
        <path d="M124 55 C127 85 127 118 122 154" stroke="#0c0a10" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />

        {/* ===== slim teenage neck ===== */}
        <path d="M91 96 L91 128 C91 135 109 135 109 128 L109 96 Z" fill="#edbd93" stroke={dark} strokeWidth="2.5" />
        <path d="M91 104 C96 112 104 112 109 104 L109 120 C104 127 96 127 91 120 Z" fill="#000000" opacity="0.18" />

        {/* ===== head — round, youthful ===== */}
        <path d="M100 25 C122 25 136 43 136 65 C136 81 132 93 124 102 C117 110 109 114 100 114 C91 114 83 110 76 102 C68 93 64 81 64 65 C64 43 78 25 100 25 Z" fill={`url(#${skinG})`} stroke={dark} strokeWidth="3" />
        <ellipse cx="86" cy="48" rx="20" ry="11" fill="#ffffff" opacity="0.12" transform="rotate(-12 86 48)" />
        <path d="M128 52 C133 66 132 86 122 100 C118 106 112 111 106 113 C118 110 128 98 131 82 C133 70 132 60 128 52 Z" fill="#000000" opacity="0.08" />
        <ellipse cx="79" cy="82" rx="8" ry="11" fill="#ffffff" opacity="0.08" transform="rotate(10 79 82)" />

        {/* ===== groomed soft eyebrows ===== */}
        <path d="M75 60.2 C80 56.4 89.5 56.2 93.5 59.2 C89 58.3 80.5 58.5 75 60.2 Z" fill="#1a161f" transform="rotate(-3 84 58)" />
        <path d="M106.5 59.2 C110.5 56.2 120 56.4 125 60.2 C119.5 58.5 111 58.3 106.5 59.2 Z" fill="#1a161f" transform="rotate(3 116 58)" />

        {/* ===== big friendly eyes ===== */}
        <ellipse cx="84.5" cy="70" rx="8.8" ry="6.6" fill="#fdfdfd" stroke={dark} strokeWidth="1.4" />
        <ellipse cx="115.5" cy="70" rx="8.8" ry="6.6" fill="#fdfdfd" stroke={dark} strokeWidth="1.4" />
        <circle cx="84.5" cy="70.3" r="5" fill={`url(#${irisG})`} stroke="#170d04" strokeWidth="0.8" />
        <circle cx="115.5" cy="70.3" r="5" fill={`url(#${irisG})`} stroke="#170d04" strokeWidth="0.8" />
        <circle cx="84.5" cy="70.3" r="2.5" fill="#0a0f18" />
        <circle cx="115.5" cy="70.3" r="2.5" fill="#0a0f18" />
        <circle cx="86.3" cy="68.3" r="1.35" fill="#ffffff" />
        <circle cx="117.3" cy="68.3" r="1.35" fill="#ffffff" />
        <circle cx="83" cy="72.5" r="0.6" fill="#ffffff" opacity="0.8" />
        <circle cx="114" cy="72.5" r="0.6" fill="#ffffff" opacity="0.8" />
        <path d="M75.9 68.9 C79.8 64.4 89.2 64.2 93.1 68.6" fill="none" stroke={dark} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M106.9 68.6 C110.8 64.2 120.2 64.4 124.1 68.9" fill="none" stroke={dark} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M75.6 68.4 L72.6 66.8" stroke={dark} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M124.4 68.4 L127.4 66.8" stroke={dark} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M78.6 74.9 C82.6 76.6 87.6 76.6 90.9 74.7" fill="none" stroke="#f6d3ac" strokeWidth="1.2" opacity="0.8" />
        <path d="M109.1 74.7 C112.4 76.6 117.4 76.6 121.4 74.9" fill="none" stroke="#f6d3ac" strokeWidth="1.2" opacity="0.8" />

        {/* ===== small button nose ===== */}
        <path d="M100.5 73 C100 77 99.3 79.8 97.9 81.9" fill="none" stroke="#c08050" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
        <path d="M95.8 83.8 C96.8 85.3 98.2 86.1 100 86.1 C101.8 86.1 103.2 85.3 104.2 83.8" fill="none" stroke="#b97a4a" strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />
        <ellipse cx="101.2" cy="80.8" rx="2.8" ry="2" fill="#ffffff" opacity="0.15" />
        <ellipse cx="100" cy="87.6" rx="4.6" ry="1.3" fill="#000000" opacity="0.10" />

        {/* ===== warm friendly smile — clean-shaven ===== */}
        <path d="M88.5 91.5 C95 98.8 105 98.8 111.5 91.5" fill="none" stroke={dark} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M92 90 C96 89 104 89 108 90" fill="none" stroke="#c08050" strokeWidth="1.3" opacity="0.55" />
        <path d="M93 97.4 C97 99.8 103 99.8 107 97.4" fill="none" stroke="#f2bd97" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
        <circle cx="87.3" cy="90.8" r="0.9" fill="#000000" opacity="0.22" />
        <circle cx="112.7" cy="90.8" r="0.9" fill="#000000" opacity="0.22" />

        {/* rosy cheeks + light freckles */}
        <ellipse cx="76.5" cy="83" rx="7" ry="4.4" fill="#e2765f" opacity="0.26" transform="rotate(-8 76.5 83)" />
        <ellipse cx="123.5" cy="83" rx="7" ry="4.4" fill="#e2765f" opacity="0.26" transform="rotate(8 123.5 83)" />
        <g fill="#b97b4e" opacity="0.45">
          <circle cx="92" cy="80.5" r="1" />
          <circle cx="96.5" cy="79" r="0.9" />
          <circle cx="103.5" cy="79" r="0.9" />
          <circle cx="108" cy="80.5" r="1" />
        </g>

        {/* ===== long front hair — volume, swept fringe, face-framing locks ===== */}
        <path
          d="M63 62 C58 26 84 11 101 12 C120 13 142 27 138 62 C136 52 131 45 124 42 C126 48 126 54 124 58 C118 46 108 41 99 42 C102 47 103 52 102 57 C95 46 84 43 76 47 C78 52 78 57 76 61 C71 56 66 58 63 62 Z"
          fill={`url(#${hairG})`} stroke={dark} strokeWidth="2.5"
        />
        {/* long left lock down to the jaw */}
        <path d="M63 58 C58 78 60 100 68 116 C70 122 76 122 76 115 C72 98 72 80 76 64 C71 58 66 56 63 58 Z" fill={`url(#${hairG})`} stroke={dark} strokeWidth="2.2" />
        {/* long right lock down to the jaw */}
        <path d="M137 58 C142 78 140 100 132 116 C130 122 124 122 124 115 C128 98 128 80 124 64 C129 58 134 56 137 58 Z" fill={`url(#${hairG})`} stroke={dark} strokeWidth="2.2" />
        {/* stray strand on the forehead */}
        <path d="M101 42 C99 50 99 56 101 63 C103 56 103 49 104 43 Z" fill="#14111a" />
        {/* blue-black sheen strands */}
        <path d="M78 24 C90 17 112 17 124 25" stroke="#5a6278" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.6" />
        <path d="M70 38 C80 28 96 23 110 25" stroke="#3d4456" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
        <path d="M120 34 C126 40 130 48 131 56" stroke="#3d4456" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.45" />
        <path d="M66 66 C63 84 64 100 69 112" stroke="#5a6278" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.4" />
        <path d="M134 66 C137 84 136 100 131 112" stroke="#5a6278" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.4" />

        {/* rim light */}
        <path d="M69 26 C60 37 55 50 54 64" stroke="rgba(255,255,255,0.30)" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* depth vignette */}
        <circle cx="100" cy="100" r="100" fill={`url(#${vinG})`} />
      </g>

      {/* metallic card ring */}
      <circle cx="100" cy="100" r="94.5" fill="none" stroke={`url(#${ringG})`} strokeWidth="3" opacity="0.95" />
      <circle cx="100" cy="100" r="97" fill="none" stroke={dark} strokeWidth="2" opacity="0.4" />
    </svg>
  );
}

function CardStarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <rect x="5" y="2.5" width="14" height="19" rx="2.5" fill="#ffd257" stroke="#0b1c3a" strokeWidth="1.8" />
      <path d="M12 6.5 L13.6 9.9 L17.3 10.3 L14.5 12.8 L15.3 16.4 L12 14.6 L8.7 16.4 L9.5 12.8 L6.7 10.3 L10.4 9.9 Z" fill="#0b1c3a" />
    </svg>
  );
}

function WhistleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path d="M3 10 H12 L14 7 H18 L16.5 11.5 C18.5 12.6 19.5 14.4 19.5 16 A6.5 6.5 0 0 1 6.5 16 C6.5 14.6 7.2 13.3 8.3 12.5 L3 12.5 Z"
        fill="#ffd257" stroke="#0b1c3a" strokeWidth="1.8" strokeLinejoin="round" transform="rotate(-8 12 12)" />
      <circle cx="12.5" cy="15.5" r="2" fill="#0b1c3a" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden>
      <path d="M5 3 H9 L11 8 L8.5 10.5 A12 12 0 0 0 13.5 15.5 L16 13 L21 15 V19 A2 2 0 0 1 19 21 A16 16 0 0 1 3 5 A2 2 0 0 1 5 3 Z" fill="currentColor" />
    </svg>
  );
}

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

export function MenuScreen({ onMode, onHowTo, onAbout }: { onMode: (m: Mode) => void; onHowTo: () => void; onAbout: () => void }) {
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
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => { sfx.click(); onHowTo(); }}
              className="mode-card plate flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 anim-rise"
              style={{ animationDelay: "280ms" }}
            >
              <TrophyIcon size={18} />
              <span className="display text-sm tracking-[0.2em] text-ink">{t.howToPlay}</span>
            </button>
            <button
              onClick={() => { sfx.click(); onAbout(); }}
              className="mode-card plate flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 anim-rise"
              style={{ animationDelay: "340ms", borderColor: "rgba(255,210,87,0.45)" }}
            >
              <CardStarIcon />
              <span className="display text-sm tracking-[0.2em] text-gold-300" style={{ color: "var(--color-gold-300)" }}>{t.about.menuBtn}</span>
            </button>
          </div>
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

/* ============================================================
   ABOUT THE DEVELOPER — the game's credits screen.
   Karen, 13, from Dubai — presented as a one-of-one golden
   player card in the same art style as the game itself.
   Supervisor: Dr. Aghaei.
   ============================================================ */
const KAREN_AGE = 13;
const KAREN_STATS = [96, 100, 97, 98]; // CODING • GAME DESIGN • FOOTBALL LOVE • FOOTBALL IQ

export function AboutScreen({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const a = t.about;
  const creditRows: [string, string][] = [
    [a.credits.idea, a.creatorName],
    [a.credits.code, a.creatorName],
    [a.credits.art, a.creatorName],
    [a.credits.supervision, a.supervisorName],
  ];
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:py-12">
      <div className="mb-6 flex items-center justify-between gap-3">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-2 text-sm text-ink-dim transition-colors hover:text-white">
          <ArrowIcon size={16} /> <span className="display tracking-[0.2em]">{t.mainMenu}</span>
        </button>
        <LangSwitch />
      </div>

      <header className="anim-rise mb-8 text-center">
        <span className="display rounded border border-pitch-line/25 bg-pitch-700/80 px-3 py-1 text-[11px] tracking-[0.25em] text-ink-dim">{a.eyebrow}</span>
        <h1 className="display text-outline mt-3 text-4xl font-bold tracking-wide text-white md:text-5xl">{a.heading}</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-dim">{a.subLine}</p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[320px_1fr]">
        {/* ---- the one-of-one golden developer card ---- */}
        <div
          className="dev-card anim-pop relative mx-auto w-full max-w-[320px] overflow-hidden rounded-2xl p-5 text-center"
          style={{
            background: "linear-gradient(165deg, #f9e28c 0%, #ecc24c 28%, #c8962a 55%, #e9c766 78%, #f7dd8d 100%)",
            border: "2px solid #8a5b00",
            boxShadow: "0 22px 48px rgba(2,6,20,0.6), inset 0 2px 0 rgba(255,255,255,0.65), inset 0 -10px 24px rgba(122,74,0,0.35)",
          }}
        >
          <div className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.35) 46%, rgba(255,255,255,0.08) 54%, transparent 70%)" }} />
          <div className="relative flex items-start justify-between">
            <div className="text-start">
              <div className="display text-6xl font-bold leading-none" style={{ color: "#4a2f00", textShadow: "0 2px 0 rgba(255,255,255,0.4)" }}>
                {t.n(KAREN_AGE)}
              </div>
              <div className="display mt-1 text-lg tracking-[0.2em]" style={{ color: "#5c3d05" }}>{a.position}</div>
            </div>
            <span className="display rounded bg-[#4a2f00]/90 px-2 py-0.5 text-[10px] tracking-[0.18em] text-[#ffd257]">{a.cardHint}</span>
          </div>
          <div className="relative mt-3 flex justify-center">
            <KarenAvatar size={150} />
          </div>
          <div className="display relative mt-2 text-4xl font-bold" style={{ color: "#3c2703", textShadow: "0 1px 0 rgba(255,255,255,0.5)" }}>
            {a.creatorName}
          </div>
          <div className="display relative text-[11px] tracking-[0.22em]" style={{ color: "#5c3d05" }}>
            {a.roleLine}
          </div>
          <div className="relative mx-auto my-4 h-px w-4/5" style={{ background: "linear-gradient(90deg, transparent, #7a4a00, transparent)" }} />
          <div className="relative flex flex-col gap-2.5">
            {a.stats.map((label, i) => (
              <div key={label}>
                <div className="display flex items-baseline justify-between text-[11px] tracking-[0.15em]" style={{ color: "#4a2f00" }}>
                  <span className="font-bold">{t.n(KAREN_STATS[i])}</span>
                  <span>{label}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#4a2f00]/30">
                  <div
                    className="stat-bar-fill h-full rounded-full"
                    style={{ width: `${KAREN_STATS[i]}%`, background: "linear-gradient(90deg, #7a4a00, #4a2f00)", animationDelay: `${300 + i * 140}ms` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---- supervisor + credits ---- */}
        <div className="flex flex-col gap-4">
          <section className="glossy anim-rise rounded-xl p-6">
            <div className="flex items-center gap-3">
              <span className="rounded-lg border border-pitch-line/20 bg-pitch-900/70 p-2.5"><WhistleIcon /></span>
              <div>
                <div className="display text-[11px] tracking-[0.25em] text-gold-400" style={{ color: "var(--color-gold-400)" }}>{a.supervisorLabel}</div>
                <h2 className="display text-2xl font-bold text-white md:text-3xl">{a.supervisorName}</h2>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-dim">{a.supervisorRole}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-pitch-line/25 bg-pitch-900/70 p-4">
              <span className="display text-[10px] tracking-[0.2em] text-ink-dim">{a.phoneLabel}</span>
              <a
                href="tel:+971551544988"
                dir="ltr"
                onClick={() => sfx.click()}
                className="btn-game display ms-auto inline-flex items-center gap-2 rounded-lg px-4 py-2 text-base tracking-[0.12em] text-white"
                style={{ background: "linear-gradient(180deg, #0aa05b, #0aa05bd0)", ["--shadow-bottom" as string]: "#064e2c" }}
              >
                <PhoneIcon />
                {a.phoneDisplay}
              </a>
            </div>
          </section>

          <section className="glossy anim-rise rounded-xl p-6" style={{ animationDelay: "120ms" }}>
            <h2 className="display mb-3 text-sm tracking-[0.25em] text-gold-400" style={{ color: "var(--color-gold-400)" }}>{a.creditsTitle}</h2>
            <dl>
              {creditRows.map(([label, name], i) => (
                <div
                  key={label}
                  className="anim-rise flex items-baseline justify-between gap-4 border-b border-dashed border-pitch-line/20 py-2.5 last:border-0"
                  style={{ animationDelay: `${220 + i * 90}ms` }}
                >
                  <dt className="text-sm text-ink-dim">{label}</dt>
                  <dd className="display text-base font-semibold text-white">{name}</dd>
                </div>
              ))}
            </dl>
          </section>

          <p className="anim-rise flex items-center justify-center gap-2 text-center text-sm text-ink-dim" style={{ animationDelay: "320ms" }}>
            <span className="anim-spin-slow inline-block"><BallIcon size={16} /></span>
            {a.madeWith}
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <GameButton color="#2757a8" size="md" onClick={() => { sfx.click(); onBack(); }}>
          {t.backToKickoff}
        </GameButton>
      </div>
    </div>
  );
}

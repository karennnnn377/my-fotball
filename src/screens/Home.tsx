import { useId } from "react";
import { DIFFICULTY_CONFIG, DIFF_ORDER, DiffKey, Mode, ROUNDS_PER_GAME } from "../engine/types";
import { CLUB_POOLS, dbStats, NATIONAL_TEAM_POOLS, questionPools } from "../engine/engine";
import { LangSwitch, Rich, useI18n } from "../i18n";
import { ArrowIcon, BallIcon, DifficultyBadge, GameButton, getBest, MuteToggle, sfx, TrophyIcon } from "../ui/Chrome";

const MODE_KEYS: Mode[] = ["quiz", "national", "club"];

/* ============================================================
   KAREN — developer portrait, fully hand-drawn SVG (v2).
   A 13-year-old boy: long black curtain-fringe hair flowing
   down past the shoulders, big low-set eyes, rosy cheeks,
   and a deep-teal blazer over a white tee. Warm golden
   studio backdrop so the dark hair reads at any size.
   No hash rolls, no props — this file IS the picture.
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
        <radialGradient id={bg} cx="50%" cy="30%" r="85%">
          <stop offset="0%" stopColor="#f8dd96" />
          <stop offset="55%" stopColor="#dca94e" />
          <stop offset="100%" stopColor="#7d5312" />
        </radialGradient>
        <radialGradient id={skinG} cx="42%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ffe3c2" />
          <stop offset="55%" stopColor="#f5c79c" />
          <stop offset="100%" stopColor="#d69c6c" />
        </radialGradient>
        <linearGradient id={hairG} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#453c63" />
          <stop offset="45%" stopColor="#251f38" />
          <stop offset="100%" stopColor="#141021" />
        </linearGradient>
        <linearGradient id={jackG} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e7a63" />
          <stop offset="45%" stopColor="#0f5243" />
          <stop offset="100%" stopColor="#093529" />
        </linearGradient>
        <radialGradient id={irisG} cx="38%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#8a5f34" />
          <stop offset="55%" stopColor="#5a3a1c" />
          <stop offset="100%" stopColor="#2e1c0a" />
        </radialGradient>
        <linearGradient id={ringG} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f9e7a0" />
          <stop offset="45%" stopColor="#caa23f" />
          <stop offset="70%" stopColor="#8a6516" />
          <stop offset="100%" stopColor="#f3d98b" />
        </linearGradient>
        <radialGradient id={vinG} cx="50%" cy="44%" r="62%">
          <stop offset="70%" stopColor="rgba(60,35,5,0)" />
          <stop offset="100%" stopColor="rgba(60,35,5,0.4)" />
        </radialGradient>
        <clipPath id={clipG}><circle cx="100" cy="100" r="97" /></clipPath>
      </defs>

      <g clipPath={`url(#${clipG})`}>
        {/* warm golden studio backdrop + spotlight */}
        <rect x="0" y="0" width="200" height="200" fill={`url(#${bg})`} />
        <circle cx="100" cy="62" r="58" fill="#ffffff" opacity="0.18" />
        <ellipse cx="100" cy="196" rx="92" ry="30" fill="#5c3a08" opacity="0.25" />

        {/* ===== long hair — one full mane behind everything ===== */}
        <path
          d="M100 12 C60 12 38 36 36 66 C35 90 40 108 38 128 C36 148 27 160 36 172 C44 183 58 182 64 172 C70 180 84 183 92 174 C96 183 108 183 114 175 C122 183 136 180 142 170 C152 177 163 168 161 154 C159 142 163 124 163 106 C163 88 166 74 164 62 C160 34 140 12 100 12 Z"
          fill={`url(#${hairG})`} stroke={dark} strokeWidth="2.5"
        />
        {/* crown sheen arcs */}
        <path d="M62 34 C78 20 122 20 138 34" stroke="#9aa3c9" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55" />
        <path d="M52 52 C70 34 130 34 148 52" stroke="#7c86a8" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.4" />
        {/* long strand lines running down both sides */}
        <path d="M44 78 C42 108 46 140 42 162" stroke="#7c86a8" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.45" />
        <path d="M156 78 C158 108 154 140 158 162" stroke="#7c86a8" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.45" />
        <path d="M52 90 C50 118 54 146 50 168" stroke="#141021" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.55" />
        <path d="M148 90 C150 118 146 146 150 168" stroke="#141021" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.55" />

        {/* ===== torso: deep-teal blazer over a white tee ===== */}
        <path d="M30 200 C34 158 56 138 80 130 L100 141 L120 130 C144 138 166 158 170 200 Z" fill={`url(#${jackG})`} stroke={dark} strokeWidth="3" />
        <path d="M30 200 C34 164 48 144 64 136 L60 200 Z" fill="#000000" opacity="0.18" />
        <path d="M170 200 C166 164 152 144 136 136 L140 200 Z" fill="#000000" opacity="0.18" />
        {/* white tee in the open V */}
        <path d="M88 132 C92 140 108 140 112 132 L110 200 L90 200 Z" fill="#f8f6ef" stroke="#d8d4c6" strokeWidth="1.5" />
        <path d="M88 132 C92 140 108 140 112 132 L111 148 C105 153 95 153 89 148 Z" fill="#e4e0d2" opacity="0.8" />
        {/* lapels */}
        <path d="M80 130 L100 141 L94 162 L82 148 Z" fill="#0c463a" stroke={dark} strokeWidth="2" />
        <path d="M120 130 L100 141 L106 162 L118 148 Z" fill="#0c463a" stroke={dark} strokeWidth="2" />
        <path d="M82 133 L97 142" stroke="#2f9a80" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
        <path d="M118 133 L103 142" stroke="#2f9a80" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
        {/* blazer edges below the lapels */}
        <path d="M94 162 L88 200" stroke="#08312a" strokeWidth="3" />
        <path d="M106 162 L112 200" stroke="#08312a" strokeWidth="3" />
        {/* golden pocket square */}
        <path d="M60 166 L74 162 L72 174 Z" fill="#ffd257" stroke="#c79a2a" strokeWidth="1.4" />
        {/* shoulder rim light */}
        <path d="M142 134 C156 142 165 155 168 172" stroke="rgba(255,255,255,0.25)" strokeWidth="3.5" fill="none" strokeLinecap="round" />

        {/* ===== slim neck ===== */}
        <path d="M91 96 L91 130 C91 137 109 137 109 130 L109 96 Z" fill="#f5c79c" stroke={dark} strokeWidth="2.5" />
        <path d="M91 104 C96 112 104 112 109 104 L109 118 C104 125 96 125 91 118 Z" fill="#000000" opacity="0.15" />

        {/* ===== round youthful head ===== */}
        <path d="M100 30 C121 30 134 46 134 66 C134 84 128 97 119 105 C113 111 107 114 100 114 C93 114 87 111 81 105 C72 97 66 84 66 66 C66 46 79 30 100 30 Z" fill={`url(#${skinG})`} stroke={dark} strokeWidth="3" />
        <ellipse cx="86" cy="50" rx="19" ry="10" fill="#ffffff" opacity="0.14" transform="rotate(-10 86 50)" />
        <path d="M127 52 C131 66 130 86 121 100 C117 106 111 111 105 113 C117 109 126 97 129 82 C131 70 130 60 127 52 Z" fill="#000000" opacity="0.07" />

        {/* soft thin brows */}
        <path d="M74.5 62.5 C79 59.2 88 59 92.5 61.6 C88 61 79.5 61.2 74.5 62.5 Z" fill="#241d2e" />
        <path d="M107.5 61.6 C112 59 121 59.2 125.5 62.5 C120.5 61.2 112 61 107.5 61.6 Z" fill="#241d2e" />

        {/* big eyes set low — unmistakably young */}
        <ellipse cx="85" cy="74" rx="8.6" ry="6.9" fill="#ffffff" stroke={dark} strokeWidth="1.4" />
        <ellipse cx="115" cy="74" rx="8.6" ry="6.9" fill="#ffffff" stroke={dark} strokeWidth="1.4" />
        <circle cx="85" cy="74.3" r="5.2" fill={`url(#${irisG})`} stroke="#241304" strokeWidth="0.8" />
        <circle cx="115" cy="74.3" r="5.2" fill={`url(#${irisG})`} stroke="#241304" strokeWidth="0.8" />
        <circle cx="85" cy="74.3" r="2.6" fill="#120b04" />
        <circle cx="115" cy="74.3" r="2.6" fill="#120b04" />
        <circle cx="86.8" cy="72.2" r="1.5" fill="#ffffff" />
        <circle cx="116.8" cy="72.2" r="1.5" fill="#ffffff" />
        <circle cx="83.4" cy="76.4" r="0.65" fill="#ffffff" opacity="0.85" />
        <circle cx="113.4" cy="76.4" r="0.65" fill="#ffffff" opacity="0.85" />
        <path d="M76.4 72.6 C80.4 68.2 89.6 68 93.4 72.4" fill="none" stroke={dark} strokeWidth="1.9" strokeLinecap="round" />
        <path d="M106.6 72.4 C110.4 68 119.6 68.2 123.6 72.6" fill="none" stroke={dark} strokeWidth="1.9" strokeLinecap="round" />
        <path d="M76.1 72.2 L73.4 70.8" stroke={dark} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M123.9 72.2 L126.6 70.8" stroke={dark} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M78.8 78.8 C82.8 80.4 87.6 80.4 90.8 78.6" fill="none" stroke="#f6d3ac" strokeWidth="1.2" opacity="0.8" />
        <path d="M109.2 78.6 C112.4 80.4 117.2 80.4 121.2 78.8" fill="none" stroke="#f6d3ac" strokeWidth="1.2" opacity="0.8" />

        {/* small button nose */}
        <path d="M100.4 77 C100 81 99.2 84 97.8 86" fill="none" stroke="#cf9260" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
        <path d="M95.8 88 C96.9 89.5 98.3 90.2 100 90.2 C101.7 90.2 103.1 89.5 104.2 88" fill="none" stroke="#c08050" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
        <ellipse cx="100" cy="91.6" rx="4.6" ry="1.2" fill="#000000" opacity="0.08" />

        {/* warm open smile — clean-shaven, no stubble anywhere */}
        <path d="M89 96 C95 102.5 105 102.5 111 96" fill="none" stroke={dark} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M92.5 94.6 C96.5 93.6 103.5 93.6 107.5 94.6" fill="none" stroke="#cf9260" strokeWidth="1.3" opacity="0.5" />
        <path d="M93.5 101.4 C97.5 103.6 102.5 103.6 106.5 101.4" fill="none" stroke="#f2bd97" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
        <circle cx="87.6" cy="95.4" r="0.9" fill="#000000" opacity="0.2" />
        <circle cx="112.4" cy="95.4" r="0.9" fill="#000000" opacity="0.2" />

        {/* rosy cheeks + freckles */}
        <ellipse cx="75.5" cy="87" rx="7.5" ry="4.8" fill="#ef8d72" opacity="0.38" transform="rotate(-8 75.5 87)" />
        <ellipse cx="124.5" cy="87" rx="7.5" ry="4.8" fill="#ef8d72" opacity="0.38" transform="rotate(8 124.5 87)" />
        <g fill="#b97b4e" opacity="0.5">
          <circle cx="92" cy="84.5" r="1" />
          <circle cx="96.5" cy="83" r="0.9" />
          <circle cx="103.5" cy="83" r="0.9" />
          <circle cx="108" cy="84.5" r="1" />
          <circle cx="88" cy="88" r="0.8" />
          <circle cx="112" cy="88" r="0.8" />
        </g>

        {/* ===== curtain fringe — natural part, falling over the forehead ===== */}
        <path d="M104 30 C88 28 72 36 66 52 C63 62 62 72 64 82 C70 73 75 64 81 57 C88 49 96 43 104 41 Z" fill={`url(#${hairG})`} stroke={dark} strokeWidth="2.2" />
        <path d="M104 30 C120 28 134 38 138 54 C140 65 140 76 136 86 C131 75 127 66 120 58 C113 50 108 43 104 41 Z" fill={`url(#${hairG})`} stroke={dark} strokeWidth="2.2" />
        {/* long front locks framing the face, down to the collarbone */}
        <path d="M66 54 C58 76 56 102 61 124 C64 138 68 148 75 154 C79 157 81 151 79 145 C72 126 71 100 76 76 C73 66 69 57 66 54 Z" fill={`url(#${hairG})`} stroke={dark} strokeWidth="2.2" />
        <path d="M134 54 C142 76 144 102 139 124 C136 138 132 148 125 154 C121 157 119 151 121 145 C128 126 129 100 124 76 C127 66 131 57 134 54 Z" fill={`url(#${hairG})`} stroke={dark} strokeWidth="2.2" />
        {/* sheen on fringe + locks */}
        <path d="M74 44 C84 36 96 33 104 34" stroke="#9aa3c9" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.55" />
        <path d="M112 35 C122 37 130 43 134 50" stroke="#9aa3c9" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.5" />
        <path d="M66 70 C62 92 63 116 69 134" stroke="#7c86a8" strokeWidth="1.7" fill="none" strokeLinecap="round" opacity="0.5" />
        <path d="M134 70 C138 92 137 116 131 134" stroke="#7c86a8" strokeWidth="1.7" fill="none" strokeLinecap="round" opacity="0.5" />
        {/* stray strand between the curtains */}
        <path d="M101 40 C99 48 99 55 101 62 C103 55 103 47 103 41 Z" fill="#141021" />

        {/* rim light */}
        <path d="M70 24 C58 36 52 50 51 64" stroke="rgba(255,255,255,0.35)" strokeWidth="3" fill="none" strokeLinecap="round" />

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

import { useId } from "react";
import { Player } from "../engine/types";

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/* ---------- palette + colour math (no external deps) ---------- */
const SKIN = ["#f2c49a", "#e8b487", "#d99e6f", "#c68863", "#a96b4a", "#8a5433", "#6b3f26"];
const HAIR = ["#161311", "#2e2016", "#4a3320", "#6b4a26", "#b98a3f", "#c9c9c9", "#8a3324", "#20242c"];
const EYES = ["#3a2a1c", "#26485e", "#2f5a38", "#57422e", "#223040", "#6b4a2c"];

function mix(hex: string, target: number, f: number): string {
  const m = hex.replace("#", "");
  const n = parseInt(m.length === 3 ? m.split("").map((c) => c + c).join("") : m.slice(0, 6), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(v + (target - v) * f)));
  const r = ch((n >> 16) & 255), g = ch((n >> 8) & 255), b = ch(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
const shade = (hex: string, f: number) => mix(hex, 0, f);
const tint = (hex: string, f: number) => mix(hex, 255, f);

interface PortraitProps {
  player: Player;
  color: string;      // team primary colour — jersey base
  color2?: string;    // team secondary colour — kit trim / stripes
  size?: number;
  showName?: boolean;
  /** Mystery mode: neutral silhouette — used BEFORE the answer so the
      correct team's colours are never leaked. */
  mystery?: boolean;
}

export default function Portrait({ player, color, color2, size = 92, showName = false, mystery = false }: PortraitProps) {
  const uid = useId().replace(/:/g, "");
  const h = hash(player.id);

  const skin = SKIN[h % SKIN.length];
  const skinHi = tint(skin, 0.38);
  const skinLo = shade(skin, 0.30);
  const hairC = HAIR[(h >> 2) % HAIR.length];
  const hairHi = tint(hairC, 0.42);
  const eyeC = EYES[(h >> 5) % EYES.length];
  const hairStyle = (h >> 4) % 8;
  const beard = (h >> 7) % 4;
  const collar = (h >> 9) % 3;
  const band = (h >> 11) % 7 === 0;

  const jersey = color;
  const jerseyHi = tint(jersey, 0.32);
  const jerseyLo = shade(jersey, 0.34);
  const trim = color2 && color2.replace("#", "").toUpperCase() !== color.replace("#", "").toUpperCase() ? color2 : "#f4f8ff";
  const trimLo = shade(trim, 0.28);

  const bgId = `pbg-${uid}`;
  const clipId = `pclip-${uid}`;
  const skinId = `psk-${uid}`;
  const jerseyId = `pjr-${uid}`;
  const irisId = `pir-${uid}`;
  const ringId = `prg-${uid}`;
  const vinId = `pvn-${uid}`;
  const qId = `pq-${uid}`;

  const dark = "#0b1c3a";
  const HEAD = "M100 24 C121 24 135 41 136 62 C136.5 76 133 89 125 99 C118 108 110 115 100 115 C90 115 82 108 75 99 C67 89 63.5 76 64 62 C65 41 79 24 100 24 Z";
  const BODY = "M20 200 C24 150 52 128 78 122 L100 132 L122 122 C148 128 176 150 180 200 Z";

  return (
    <div className="flex flex-col items-center gap-1" style={{ width: size + 8 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        role="img"
        aria-label={mystery ? "Mystery player" : player.name}
        className="portrait-ring rounded-full"
        style={{ shapeRendering: "geometricPrecision" }}
      >
        <defs>
          <radialGradient id={bgId} cx="50%" cy="30%" r="85%">
            {mystery ? (
              <>
                <stop offset="0%" stopColor="#27476f" />
                <stop offset="100%" stopColor="#0b1a38" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor={tint(jersey, 0.18)} />
                <stop offset="55%" stopColor={shade(jersey, 0.42)} />
                <stop offset="100%" stopColor="#0a1a36" />
              </>
            )}
          </radialGradient>
          <radialGradient id={skinId} cx="42%" cy="32%" r="80%">
            <stop offset="0%" stopColor={skinHi} />
            <stop offset="55%" stopColor={skin} />
            <stop offset="100%" stopColor={skinLo} />
          </radialGradient>
          <linearGradient id={jerseyId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={jerseyHi} />
            <stop offset="45%" stopColor={jersey} />
            <stop offset="100%" stopColor={jerseyLo} />
          </linearGradient>
          <radialGradient id={irisId} cx="38%" cy="35%" r="75%">
            <stop offset="0%" stopColor={tint(eyeC, 0.35)} />
            <stop offset="60%" stopColor={eyeC} />
            <stop offset="100%" stopColor={shade(eyeC, 0.55)} />
          </radialGradient>
          <linearGradient id={ringId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f9e08a" />
            <stop offset="45%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#caa23f" />
          </linearGradient>
          <radialGradient id={vinId} cx="50%" cy="42%" r="70%">
            <stop offset="62%" stopColor="#020818" stopOpacity="0" />
            <stop offset="100%" stopColor="#020818" stopOpacity="0.42" />
          </radialGradient>
          <linearGradient id={qId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe08a" />
            <stop offset="100%" stopColor="#d18f12" />
          </linearGradient>
          <clipPath id={clipId}>
            <circle cx="100" cy="100" r="98" />
          </clipPath>
        </defs>

        <g clipPath={`url(#${clipId})`}>
          <rect width="200" height="200" fill={`url(#${bgId})`} />

          {mystery ? (
            /* ===== neutral silhouette — reveals nothing about the team ===== */
            <g>
              <path d={BODY} fill="#22375f" stroke="#0a1730" strokeWidth="3" />
              <path d="M20 200 C24 158 44 136 62 128 L58 200 Z" fill="#000000" opacity="0.22" />
              <path d="M180 200 C176 158 156 136 138 128 L142 200 Z" fill="#000000" opacity="0.22" />
              <path d="M88 96 L88 128 C88 136 112 136 112 128 L112 96 Z" fill="#22375f" stroke="#0a1730" strokeWidth="2.5" />
              <ellipse cx="100" cy="66" rx="34" ry="39" fill="#22375f" stroke="#0a1730" strokeWidth="3" />
              <ellipse cx="66" cy="70" rx="6" ry="9" fill="#22375f" stroke="#0a1730" strokeWidth="2.5" />
              <ellipse cx="134" cy="70" rx="6" ry="9" fill="#22375f" stroke="#0a1730" strokeWidth="2.5" />
              <path d="M66 58 C66 28 134 28 134 58 C134 38 120 26 100 26 C80 26 66 38 66 58 Z" fill="#1a2c4e" stroke="#0a1730" strokeWidth="2.5" />
              <path d="M70 32 C58 44 52 60 53 78" stroke="rgba(255,255,255,0.22)" strokeWidth="3" fill="none" strokeLinecap="round" />
              <ellipse cx="70" cy="34" rx="52" ry="30" fill="#ffffff" opacity="0.05" />
              <circle cx="100" cy="150" r="27" fill={`url(#${qId})`} stroke="#0a1730" strokeWidth="3" />
              <text
                x="100" y="165" textAnchor="middle"
                fontFamily="var(--font-display)" fontSize="42" fontWeight="700"
                fill="#0b1c3a"
              >
                ?
              </text>
            </g>
          ) : (
            <g>
              {/* ambient floor shadow + back spotlight */}
              <ellipse cx="100" cy="196" rx="92" ry="34" fill="#000000" opacity="0.30" />
              <circle cx="100" cy="74" r="62" fill="#ffffff" opacity="0.05" />

              {/* ===== torso / jersey ===== */}
              <path d={BODY} fill={`url(#${jerseyId})`} stroke={dark} strokeWidth="3" />
              {/* side shading */}
              <path d="M20 200 C24 158 44 136 62 128 L58 200 Z" fill="#000000" opacity="0.20" />
              <path d="M180 200 C176 158 156 136 138 128 L142 200 Z" fill="#000000" opacity="0.20" />
              {/* shoulder trim stripes (team secondary colour) */}
              <g fill={trim} stroke={trimLo} strokeWidth="1">
                <path d="M47 139 L71 127 L75 134 L51 146 Z" />
                <path d="M39 148 L63 136 L67 143 L43 155 Z" />
                <path d="M153 139 L129 127 L125 134 L149 146 Z" />
                <path d="M161 148 L137 136 L133 143 L157 155 Z" />
              </g>
              {/* fabric folds */}
              <g fill="none" stroke="#000000" strokeWidth="2.4" opacity="0.13" strokeLinecap="round">
                <path d="M78 150 C86 162 88 178 86 198" />
                <path d="M122 150 C114 162 112 178 114 198" />
                <path d="M100 152 C99 168 100 184 100 199" />
              </g>
              {/* chest sheen */}
              <ellipse cx="78" cy="152" rx="26" ry="34" fill="#ffffff" opacity="0.06" transform="rotate(-18 78 152)" />
              {/* rim light on right shoulder */}
              <path d="M146 132 C162 140 172 156 176 176" stroke="rgba(255,255,255,0.22)" strokeWidth="4" fill="none" strokeLinecap="round" />

              {/* collar */}
              {collar === 0 && (
                <g>
                  <path d="M82 122 L100 146 L118 122 L112 118 L100 132 L88 118 Z" fill={skin} stroke={dark} strokeWidth="2.5" />
                  <path d="M84 121 L100 142 L116 121" fill="none" stroke={trim} strokeWidth="2" />
                </g>
              )}
              {collar === 1 && (
                <g>
                  <path d="M82 121 C90 134 110 134 118 121 L118 127 C110 140 90 140 82 127 Z" fill="#f4f8ff" stroke={dark} strokeWidth="2" />
                  <path d="M83 124 C91 136 109 136 117 124" fill="none" stroke={trim} strokeWidth="1.6" />
                </g>
              )}
              {collar === 2 && (
                <g>
                  <path d="M80 120 L100 142 L120 120 L126 126 L100 152 L74 126 Z" fill="#f4f8ff" stroke={dark} strokeWidth="2.5" />
                  <path d="M81 121 L100 141 L119 121" fill="none" stroke={trim} strokeWidth="1.8" />
                  <rect x="94" y="142" width="12" height="14" fill="#f4f8ff" stroke={dark} strokeWidth="2" />
                  <circle cx="100" cy="148" r="1.6" fill={trim} />
                </g>
              )}

              {/* ===== neck ===== */}
              <path d="M88 96 L88 128 C88 136 112 136 112 128 L112 96 Z" fill={skin} stroke={dark} strokeWidth="2.5" />
              <path d="M88 104 C94 114 106 114 112 104 L112 122 C106 129 94 129 88 122 Z" fill="#000000" opacity="0.20" />

              {/* ===== ears ===== */}
              <ellipse cx="64.5" cy="71" rx="6.5" ry="10" fill={skin} stroke={dark} strokeWidth="2.5" />
              <ellipse cx="135.5" cy="71" rx="6.5" ry="10" fill={skin} stroke={dark} strokeWidth="2.5" />
              <path d="M63 66 C61 70 61 74 63.5 77" stroke={shade(skin, 0.4)} strokeWidth="1.6" fill="none" />
              <path d="M137 66 C139 70 139 74 136.5 77" stroke={shade(skin, 0.4)} strokeWidth="1.6" fill="none" />

              {/* ===== head ===== */}
              <path d={HEAD} fill={`url(#${skinId})`} stroke={dark} strokeWidth="3" />
              {/* key-light forehead highlight */}
              <ellipse cx="88" cy="47" rx="21" ry="12" fill="#ffffff" opacity="0.12" transform="rotate(-12 88 47)" />
              {/* shaded side of the face */}
              <path d="M128 52 C133 66 132 86 122 100 C118 106 112 111 106 113 C118 110 128 98 131 82 C133 70 132 60 128 52 Z" fill="#000000" opacity="0.10" />
              {/* cheek highlight */}
              <ellipse cx="80" cy="82" rx="9" ry="12" fill="#ffffff" opacity="0.08" transform="rotate(10 80 82)" />
              {/* brow-ridge soft shadow */}
              <ellipse cx="84" cy="62" rx="11" ry="3.4" fill="#000000" opacity="0.08" />
              <ellipse cx="116" cy="62" rx="11" ry="3.4" fill="#000000" opacity="0.08" />

              {/* ===== hair ===== */}
              {hairStyle === 0 && (
                <g>
                  <path d="M68 52 C72 28 128 28 132 52 C132 40 124 30 100 28 C76 30 68 40 68 52 Z" fill={hairC} stroke={dark} strokeWidth="2" />
                  <path d="M78 38 C88 32 104 31 116 36" stroke={hairHi} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.7" />
                </g>
              )}
              {hairStyle === 1 && (
                <g>
                  <path d="M66 58 C66 28 134 28 134 58 C134 38 122 26 100 26 C78 26 66 38 66 58 Z" fill={hairC} stroke={dark} strokeWidth="2.5" />
                  <path d="M74 42 C84 32 116 32 126 42" stroke={hairHi} strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.65" />
                  <path d="M68 56 C68 46 74 38 82 34" stroke={shade(hairC, 0.35)} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.6" />
                </g>
              )}
              {hairStyle === 2 && (
                <g>
                  <path d="M66 60 C64 32 100 24 120 32 C134 38 136 50 134 60 C130 42 118 36 104 38 C84 40 70 48 66 60 Z" fill={hairC} stroke={dark} strokeWidth="2.5" />
                  <path d="M84 36 C96 32 112 34 122 42" stroke={hairHi} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.7" />
                </g>
              )}
              {hairStyle === 3 && (
                <g fill={hairC} stroke={dark} strokeWidth="2">
                  <circle cx="78" cy="38" r="11" />
                  <circle cx="94" cy="30" r="12" />
                  <circle cx="112" cy="32" r="11" />
                  <circle cx="126" cy="42" r="10" />
                  <circle cx="68" cy="48" r="9" />
                  <path d="M76 32 C88 24 112 24 124 36" stroke={hairHi} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.6" />
                </g>
              )}
              {hairStyle === 4 && (
                <g>
                  <path d="M64 56 C62 28 138 28 136 56 L140 116 C140 124 128 124 128 114 L128 60 C120 44 80 44 72 60 L72 114 C72 124 60 124 60 116 Z" fill={hairC} stroke={dark} strokeWidth="2.5" />
                  <path d="M70 44 C80 34 120 34 130 44" stroke={hairHi} strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.6" />
                  <path d="M63 70 C62 90 62 104 64 114" stroke={shade(hairC, 0.3)} strokeWidth="2.2" fill="none" opacity="0.55" />
                  <path d="M137 70 C138 90 138 104 136 114" stroke={shade(hairC, 0.3)} strokeWidth="2.2" fill="none" opacity="0.55" />
                </g>
              )}
              {hairStyle === 5 && (
                <g>
                  <rect x="90" y="22" width="20" height="22" rx="6" fill={hairC} stroke={dark} strokeWidth="2.5" />
                  <path d="M93 26 C97 23 103 23 107 26" stroke={hairHi} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
                </g>
              )}
              {hairStyle === 6 && (
                <g>
                  <path d="M74 42 C80 34 120 34 126 42 C120 38 80 38 74 42 Z" fill="#ffffff" opacity="0.3" />
                  <path d="M70 46 C78 36 122 36 130 46" stroke={shade(skin, 0.22)} strokeWidth="2" fill="none" opacity="0.5" />
                </g>
              )}
              {hairStyle === 7 && (
                <g>
                  <path d="M68 48 L76 28 L84 44 L92 24 L100 42 L108 24 L116 44 L124 28 L132 48 C122 38 78 38 68 48 Z" fill={hairC} stroke={dark} strokeWidth="2" />
                  <path d="M80 36 L92 30 L104 32 L118 34" stroke={hairHi} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
                </g>
              )}
              {/* hairline shadow */}
              <path d="M70 52 C80 42 120 42 130 52" stroke="#000000" strokeWidth="2" fill="none" opacity="0.12" />
              {/* headband */}
              {band && (
                <g>
                  <rect x="66" y="44" width="68" height="9" rx="4" fill="#e8e8e8" stroke={dark} strokeWidth="2" />
                  <rect x="66" y="44" width="68" height="3.4" rx="1.7" fill="#ffffff" opacity="0.5" />
                </g>
              )}

              {/* ===== eyebrows ===== */}
              <path d="M74 58.5 C79 55 88 54.8 92.5 57.5 C88 57 79.5 57.2 74 58.5 Z" fill={shade(hairC, 0.15)} transform="rotate(-4 83 57)" />
              <path d="M107.5 57.5 C112 54.8 121 55 126 58.5 C120.5 57.2 112 57 107.5 57.5 Z" fill={shade(hairC, 0.15)} transform="rotate(4 117 57)" />

              {/* ===== eyes ===== */}
              <g>
                <path d="M76.5 69.5 C79.5 64.8 89 64.2 92 68.8 C89 73.4 79.8 73.8 76.5 69.5 Z" fill="#fdfdfd" stroke={dark} strokeWidth="1.4" />
                <path d="M108 68.8 C111 64.2 120.5 64.8 123.5 69.5 C120.2 73.8 111 73.4 108 68.8 Z" fill="#fdfdfd" stroke={dark} strokeWidth="1.4" />
                <circle cx="84.6" cy="69" r="3.5" fill={`url(#${irisId})`} stroke={shade(eyeC, 0.6)} strokeWidth="0.8" />
                <circle cx="115.4" cy="69" r="3.5" fill={`url(#${irisId})`} stroke={shade(eyeC, 0.6)} strokeWidth="0.8" />
                <circle cx="84.6" cy="69" r="1.7" fill="#0a0f18" />
                <circle cx="115.4" cy="69" r="1.7" fill="#0a0f18" />
                <circle cx="85.8" cy="67.8" r="1" fill="#ffffff" />
                <circle cx="116.6" cy="67.8" r="1" fill="#ffffff" />
                <circle cx="83.6" cy="70.2" r="0.5" fill="#ffffff" opacity="0.8" />
                <circle cx="114.4" cy="70.2" r="0.5" fill="#ffffff" opacity="0.8" />
                {/* upper lids + lower-lid light line */}
                <path d="M76.5 68.6 C80 64.6 89 64.2 92 68.2" fill="none" stroke={dark} strokeWidth="1.8" strokeLinecap="round" />
                <path d="M108 68.2 C111 64.2 120 64.6 123.5 68.6" fill="none" stroke={dark} strokeWidth="1.8" strokeLinecap="round" />
                <path d="M79 72.6 C83 74 88 74 91 72.4" fill="none" stroke={tint(skin, 0.3)} strokeWidth="1.2" opacity="0.8" />
                <path d="M109 72.4 C112 74 117 74 121 72.6" fill="none" stroke={tint(skin, 0.3)} strokeWidth="1.2" opacity="0.8" />
              </g>

              {/* ===== nose ===== */}
              <path d="M100.5 70 C100 76 98.6 80.5 96.6 83.6" fill="none" stroke={shade(skin, 0.42)} strokeWidth="2" strokeLinecap="round" opacity="0.75" />
              <path d="M94.5 85.5 C95.5 87.4 97.5 88.2 100 88.2 C102.5 88.2 104.5 87.4 105.5 85.5" fill="none" stroke={shade(skin, 0.45)} strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
              <ellipse cx="101.5" cy="82.5" rx="3.4" ry="2.4" fill="#ffffff" opacity="0.16" />
              <ellipse cx="100" cy="89.5" rx="6" ry="1.6" fill="#000000" opacity="0.10" />

              {/* ===== mouth ===== */}
              <path d="M90 94 C95 98.6 105 98.6 110 94" fill="none" stroke={dark} strokeWidth="2.6" strokeLinecap="round" />
              <path d="M92 92.4 C96 91.2 104 91.2 108 92.4" fill="none" stroke={shade(skin, 0.35)} strokeWidth="1.4" opacity="0.6" />
              <path d="M93.5 99.6 C97.5 101.8 102.5 101.8 106.5 99.6" fill="none" stroke={tint(skin, 0.32)} strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
              {/* chin crease */}
              <path d="M95 106 C98 107.6 102 107.6 105 106" fill="none" stroke={shade(skin, 0.3)} strokeWidth="1.4" opacity="0.4" />

              {/* ===== beard ===== */}
              {beard === 1 && (
                <path d="M72 74 C74 96 86 106 100 106 C114 106 126 96 128 74 C128 96 118 112 100 112 C82 112 72 96 72 74 Z" fill={hairC} opacity="0.24" />
              )}
              {beard === 2 && (
                <g fill={hairC} stroke={shade(hairC, 0.4)} strokeWidth="1.4">
                  <path d="M90 91 C89 103 94 110 100 111 C106 110 111 103 110 91 C112 105 107 114 100 115 C93 114 88 105 90 91 Z" />
                  <path d="M91 90 C95 88.4 105 88.4 109 90 C105 91.8 95 91.8 91 90 Z" />
                </g>
              )}
              {beard === 3 && (
                <g>
                  <path d="M70 68 C70 98 82 113 100 113 C118 113 130 98 130 68 L130 84 C130 105 116 119 100 119 C84 119 70 105 70 84 Z" fill={hairC} stroke={shade(hairC, 0.4)} strokeWidth="1.6" />
                  <path d="M90 90 C95 88 105 88 110 90 C106 92.4 94 92.4 90 90 Z" fill={hairC} />
                  <path d="M76 78 C80 96 88 106 100 108" stroke={hairHi} strokeWidth="1.6" fill="none" opacity="0.4" />
                </g>
              )}

              {/* rim light on the lit side of the head */}
              <path d="M70 30 C58 42 52 58 53 76" stroke="rgba(255,255,255,0.32)" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* global specular + vignette for 3D depth */}
          <ellipse cx="72" cy="26" rx="72" ry="30" fill="#ffffff" opacity="0.07" />
          <circle cx="100" cy="100" r="98" fill={`url(#${vinId})`} />
        </g>

        {/* metallic inner ring */}
        <circle cx="100" cy="100" r="94.5" fill="none" stroke={`url(#${ringId})`} strokeWidth="3" opacity="0.9" />
        <circle cx="100" cy="100" r="97" fill="none" stroke={dark} strokeWidth="2" opacity="0.4" />
        {mystery && <circle cx="100" cy="100" r="90" fill="none" stroke="#ffd257" strokeWidth="2.5" strokeDasharray="7 9" opacity="0.55" />}
      </svg>
      {showName && (
        <span
          className="display text-center leading-tight text-ink"
          style={{ fontSize: Math.max(10, size * 0.135), textShadow: "0 2px 4px rgba(2,6,20,0.9)" }}
        >
          {player.name}
        </span>
      )}
    </div>
  );
}

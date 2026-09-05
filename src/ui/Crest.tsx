import { useId } from "react";

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const SHIELDS = [
  "M60 8 L104 22 V70 C104 104 84 124 60 134 C36 124 16 104 16 70 V22 Z",
  "M60 6 L106 20 L100 80 L60 134 L20 80 L14 20 Z",
  "M18 14 H102 V84 L60 132 L18 84 Z",
  "M60 10 C80 10 98 16 104 18 V72 C104 102 86 122 60 132 C34 122 16 102 16 72 V18 C22 16 40 10 60 10 Z",
];

interface CrestProps {
  id: string;
  name: string;
  code: string;
  c1: string;
  c2: string;
  size?: number;
  title?: boolean;
}

export default function Crest({ id, name, code, c1, c2, size = 96, title = true }: CrestProps) {
  const uid = useId().replace(/:/g, "");
  const h = hash(id + name);
  const shape = SHIELDS[h % SHIELDS.length];
  const pattern = h % 8;
  const emblem = (h >> 3) % 6;
  const star = h % 3 === 0;
  const chief = (h >> 5) % 3 === 0;

  const clipId = `clip-${uid}`;
  const glossId = `gloss-${uid}`;
  const goldId = `gold-${uid}`;
  const shadeId = `shade-${uid}`;
  const sheenId = `sheen-${uid}`;

  const DARK = "#0b1c3a";
  const GOLD = "#ffd257";

  return (
    <svg
      width={size}
      height={size * 1.12}
      viewBox="0 0 120 140"
      role="img"
      aria-label={name}
      style={{ filter: "drop-shadow(0 8px 12px rgba(2,6,20,0.6)) drop-shadow(0 2px 3px rgba(2,6,20,0.5))", flexShrink: 0, shapeRendering: "geometricPrecision" }}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={shape} />
        </clipPath>
        <linearGradient id={goldId} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#f9e08a" />
          <stop offset="0.35" stopColor="#e8c55a" />
          <stop offset="0.6" stopColor="#a87413" />
          <stop offset="0.8" stopColor="#e0b94e" />
          <stop offset="1" stopColor="#f4d879" />
        </linearGradient>
        <linearGradient id={glossId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="0.4" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.26" />
        </linearGradient>
        <radialGradient id={shadeId} cx="50%" cy="42%" r="72%">
          <stop offset="55%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.34" />
        </radialGradient>
        <linearGradient id={sheenId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0.42" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="0.58" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* prestige star above the shield */}
      {star && (
        <path
          d="M60 0.5 L62.6 6 L68.6 6.6 L64.1 10.6 L65.4 16.5 L60 13.4 L54.6 16.5 L55.9 10.6 L51.4 6.6 L57.4 6 Z"
          fill={`url(#${goldId})`} stroke={DARK} strokeWidth="1.6"
        />
      )}

      {/* depth: dark under-plate */}
      <path d={shape} transform="translate(0 3)" fill="#04101f" opacity="0.85" />

      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width="120" height="140" fill={c1} />

        {/* ===== field patterns ===== */}
        {pattern === 1 && [0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={4 + i * 24} y="0" width="12" height="140" fill={c2} />
        ))}
        {pattern === 2 && [0, 1, 2, 3].map((i) => (
          <rect key={i} x="0" y={12 + i * 30} width="120" height="14" fill={c2} />
        ))}
        {pattern === 3 && <rect x="60" y="0" width="60" height="140" fill={c2} />}
        {pattern === 4 && <path d="M-20 120 L80 -20 L120 -20 L20 140 Z" fill={c2} />}
        {pattern === 5 && <path d="M0 78 L60 40 L120 78 L120 100 L60 62 L0 100 Z" fill={c2} />}
        {pattern === 6 && (
          <g fill={c2}>
            <rect x="0" y="0" width="60" height="70" />
            <rect x="60" y="70" width="60" height="70" />
          </g>
        )}
        {pattern === 7 && <path d="M60 0 L120 40 V70 L60 34 L0 70 V40 Z" fill={c2} />}

        {/* chief band with mini stars */}
        {chief && (
          <g>
            <rect x="0" y="0" width="120" height="22" fill={c2} />
            <rect x="0" y="22" width="120" height="2.4" fill={`url(#${goldId})`} />
            {[38, 60, 82].map((x) => (
              <path key={x} transform={`translate(${x} 11) scale(0.42)`}
                d="M0 -10 L2.9 -3.1 L10 -3.1 L4.6 1.6 L6.9 9 L0 4.6 L-6.9 9 L-4.6 1.6 L-10 -3.1 L-2.9 -3.1 Z"
                fill={GOLD} stroke={DARK} strokeWidth="1.4" />
            ))}
          </g>
        )}

        {/* ===== emblem ===== */}
        {emblem === 0 && (
          <g transform="translate(60 74)">
            <circle r="21" fill="#ffffff" stroke={DARK} strokeWidth="2.6" />
            <path d="M0 -9.5 L9 -3.2 L5.6 7.8 L-5.6 7.8 L-9 -3.2 Z" fill={DARK} />
            <path d="M0 -9.5 L0 -19 M9 -3.2 L18 -8.5 M5.6 7.8 L12.5 16 M-5.6 7.8 L-12.5 16 M-9 -3.2 L-18 -8.5" stroke={DARK} strokeWidth="2.1" fill="none" />
            <ellipse cx="-6" cy="-9" rx="9" ry="5" fill="#ffffff" opacity="0.5" />
          </g>
        )}
        {emblem === 1 && (
          <path
            d="M60 46 L66.5 62.5 L84 64 L70.5 76 L75 93 L60 84 L45 93 L49.5 76 L36 64 L53.5 62.5 Z"
            fill={`url(#${goldId})`} stroke={DARK} strokeWidth="2.5"
          />
        )}
        {emblem === 2 && (
          <g transform="translate(60 72)">
            <rect x="-16" y="-16" width="32" height="32" transform="rotate(45)" fill="#ffffff" stroke={DARK} strokeWidth="2.5" />
            <rect x="-8" y="-8" width="16" height="16" transform="rotate(45)" fill={c2 === "#ffffff" || c2 === "#F0F0F0" ? DARK : c2} />
          </g>
        )}
        {emblem === 3 && (
          <path d="M60 46 L75 65 L66.5 65 L77 84 L64.5 84 L71 102 L49 102 L55.5 84 L43 84 L53.5 65 L45 65 Z"
            fill={`url(#${goldId})`} stroke={DARK} strokeWidth="2" strokeLinejoin="round" />
        )}
        {emblem === 4 && (
          <g>
            <path d="M44 62 L48 50 L54 60 L60 46 L66 60 L72 50 L76 62 L76 70 L44 70 Z" fill={`url(#${goldId})`} stroke={DARK} strokeWidth="2.2" strokeLinejoin="round" />
            <rect x="44" y="70" width="32" height="5" fill={DARK} />
            <circle cx="52" cy="58" r="2.2" fill={DARK} />
            <circle cx="60" cy="54" r="2.2" fill={DARK} />
            <circle cx="68" cy="58" r="2.2" fill={DARK} />
            <circle cx="60" cy="88" r="9" fill="#ffffff" stroke={DARK} strokeWidth="2.2" />
            <path d="M60 83.5 L64 86.4 L62.5 91 L57.5 91 L56 86.4 Z" fill={DARK} />
          </g>
        )}
        {emblem === 5 && (
          <g>
            <path d="M38 92 C34 76 40 62 52 54 C46 66 45 80 48 92 Z" fill={`url(#${goldId})`} stroke={DARK} strokeWidth="1.8" />
            <path d="M82 92 C86 76 80 62 68 54 C74 66 75 80 72 92 Z" fill={`url(#${goldId})`} stroke={DARK} strokeWidth="1.8" />
            <circle cx="60" cy="76" r="13" fill="#ffffff" stroke={DARK} strokeWidth="2.4" />
            <path d="M60 70 L65.7 74.2 L63.5 80.8 L56.5 80.8 L54.3 74.2 Z" fill={DARK} />
            <path d="M60 70 L60 63 M65.7 74.2 L72 71 M63.5 80.8 L68 87 M56.5 80.8 L52 87 M54.3 74.2 L48 71" stroke={DARK} strokeWidth="1.8" fill="none" />
          </g>
        )}

        {/* depth + light passes */}
        <path d={shape} fill={`url(#${shadeId})`} />
        <path d={shape} fill={`url(#${glossId})`} />
        <path d={shape} fill={`url(#${sheenId})`} />
        <ellipse cx="42" cy="18" rx="40" ry="14" fill="#ffffff" opacity="0.14" />
      </g>

      {/* bevel border stack */}
      <path d={shape} fill="none" stroke={DARK} strokeWidth="5" />
      <path d={shape} fill="none" stroke={`url(#${goldId})`} strokeWidth="2.4" />
      <path d={shape} fill="none" stroke={DARK} strokeWidth="1.1" opacity="0.75"
        transform="translate(60 71) scale(0.945) translate(-60 -71)" />

      {/* dovetail ribbon */}
      <g transform="translate(60 118)">
        <path d="M-36 4 L-30 0 L-30 20 L-36 16 L-32.5 10 Z" fill="#081426" stroke={DARK} strokeWidth="1.2" />
        <path d="M36 4 L30 0 L30 20 L36 16 L32.5 10 Z" fill="#081426" stroke={DARK} strokeWidth="1.2" />
        <rect x="-30" y="0" width="60" height="20" fill="#12233f" stroke={DARK} strokeWidth="1.6" />
        <rect x="-30" y="0" width="60" height="6" fill="#ffffff" opacity="0.10" />
        <rect x="-27" y="2.6" width="54" height="14.8" fill="none" stroke={GOLD} strokeWidth="0.9" strokeDasharray="3 2.4" opacity="0.8" />
        {title && (
          <text
            x="0" y="14.2" textAnchor="middle"
            fontFamily="Oswald, sans-serif" fontSize="11" fontWeight="600" letterSpacing="1.2"
            fill={GOLD} style={{ textShadow: "0 1px 1px rgba(0,0,0,0.8)" }}
          >
            {code}
          </text>
        )}
      </g>
    </svg>
  );
}

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
  const pattern = h % 6;
  const emblem = (h >> 3) % 4;
  const clipId = `clip-${uid}`;
  const glossId = `gloss-${uid}`;

  return (
    <svg
      width={size}
      height={size * 1.12}
      viewBox="0 0 120 140"
      role="img"
      aria-label={name}
      style={{ filter: "drop-shadow(0 6px 10px rgba(2,6,20,0.55))", flexShrink: 0 }}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={shape} />
        </clipPath>
        <linearGradient id={glossId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.38" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.22" />
        </linearGradient>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width="120" height="140" fill={c1} />
        {pattern === 1 &&
          [0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={8 + i * 24} y="0" width="12" height="140" fill={c2} />
          ))}
        {pattern === 2 &&
          [0, 1, 2, 3].map((i) => (
            <rect key={i} x="0" y={14 + i * 30} width="120" height="14" fill={c2} />
          ))}
        {pattern === 3 && <rect x="60" y="0" width="60" height="140" fill={c2} />}
        {pattern === 4 && (
          <path d="M-20 120 L80 -20 L120 -20 L20 140 Z" fill={c2} />
        )}
        {pattern === 5 && (
          <>
            <path d="M0 78 L60 40 L120 78 L120 100 L60 62 L0 100 Z" fill={c2} />
          </>
        )}

        {/* emblem */}
        {emblem === 0 && (
          <g transform="translate(60 72)">
            <circle r="20" fill="#ffffff" stroke="#0b1c3a" strokeWidth="2.5" />
            <path d="M0 -9 L8.5 -3 L5.3 7.3 L-5.3 7.3 L-8.5 -3 Z" fill="#0b1c3a" />
            <path d="M0 -9 L0 -18 M8.5 -3 L17 -8 M5.3 7.3 L12 15 M-5.3 7.3 L-12 15 M-8.5 -3 L-17 -8" stroke="#0b1c3a" strokeWidth="2" fill="none" />
          </g>
        )}
        {emblem === 1 && (
          <path
            d="M60 46 L66.5 62.5 L84 64 L70.5 76 L75 93 L60 84 L45 93 L49.5 76 L36 64 L53.5 62.5 Z"
            fill="#ffd257"
            stroke="#0b1c3a"
            strokeWidth="2.5"
          />
        )}
        {emblem === 2 && (
          <g transform="translate(60 70)">
            <rect x="-15" y="-15" width="30" height="30" transform="rotate(45)" fill="#ffffff" stroke="#0b1c3a" strokeWidth="2.5" />
            <rect x="-7" y="-7" width="14" height="14" transform="rotate(45)" fill={c2 === "#ffffff" ? "#0b1c3a" : c2} />
          </g>
        )}
        {emblem === 3 && (
          <g fill="#ffd257" stroke="#0b1c3a" strokeWidth="2">
            <path d="M60 48 L74 66 L66 66 L76 84 L64 84 L70 100 L50 100 L56 84 L44 84 L54 66 L46 66 Z" />
          </g>
        )}

        <path d={shape} fill={`url(#${glossId})`} />
      </g>

      <path d={shape} fill="none" stroke="#0b1c3a" strokeWidth="4" />
      <path d={shape} fill="none" stroke="#ffd257" strokeWidth="1.4" opacity="0.85" />

      {/* ribbon */}
      <g transform="translate(60 118)">
        <path d="M-30 0 L30 0 L36 10 L30 20 L-30 20 L-36 10 Z" fill="#0b1c3a" stroke="#ffd257" strokeWidth="1.2" />
        {title && (
          <text
            x="0"
            y="14"
            textAnchor="middle"
            fontFamily="Oswald, sans-serif"
            fontSize="11"
            fontWeight="600"
            letterSpacing="1"
            fill="#ffd257"
          >
            {code}
          </text>
        )}
      </g>
    </svg>
  );
}

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

const SKIN = ["#f2c49a", "#e8b487", "#d99e6f", "#c68863", "#a96b4a", "#8a5433", "#6b3f26"];
const HAIR = ["#161311", "#2e2016", "#4a3320", "#6b4a26", "#b98a3f", "#c9c9c9", "#8a3324", "#20242c"];

interface PortraitProps {
  player: Player;
  color: string;
  size?: number;
  showName?: boolean;
}

export default function Portrait({ player, color, size = 92, showName = false }: PortraitProps) {
  const uid = useId().replace(/:/g, "");
  const h = hash(player.id);
  const skin = SKIN[h % SKIN.length];
  const hairC = HAIR[(h >> 2) % HAIR.length];
  const hairStyle = (h >> 4) % 8;
  const beard = (h >> 7) % 4; // 0 none,1 stubble,2 goatee,3 full
  const collar = (h >> 9) % 3; // 0 v,1 crew,2 polo
  const band = (h >> 11) % 7 === 0; // rare headband
  const bgId = `pbg-${uid}`;
  const clipId = `pclip-${uid}`;

  const dark = "#0b1c3a";

  return (
    <div className="flex flex-col items-center gap-1" style={{ width: size + 8 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        role="img"
        aria-label={player.name}
        className="portrait-ring rounded-full"
      >
        <defs>
          <radialGradient id={bgId} cx="50%" cy="32%" r="80%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#0a1a36" />
          </radialGradient>
          <clipPath id={clipId}>
            <circle cx="100" cy="100" r="98" />
          </clipPath>
        </defs>

        <g clipPath={`url(#${clipId})`}>
          <rect width="200" height="200" fill={`url(#${bgId})`} />

          {/* shoulders / jersey */}
          <path d="M20 200 C24 150 52 128 78 122 L100 132 L122 122 C148 128 176 150 180 200 Z" fill={color} stroke={dark} strokeWidth="3" />
          <path d="M20 200 C24 150 52 128 78 122 L100 132 L122 122 C148 128 176 150 180 200 Z" fill="#ffffff" opacity="0.10" />
          {/* sleeves shading */}
          <path d="M20 200 C24 158 44 136 62 128 L58 200 Z" fill="#000000" opacity="0.18" />
          <path d="M180 200 C176 158 156 136 138 128 L142 200 Z" fill="#000000" opacity="0.18" />
          {/* collar */}
          {collar === 0 && <path d="M82 122 L100 146 L118 122 L112 118 L100 132 L88 118 Z" fill={skin} stroke={dark} strokeWidth="2.5" />}
          {collar === 1 && <path d="M82 121 C90 134 110 134 118 121 L118 127 C110 140 90 140 82 127 Z" fill="#ffffff" stroke={dark} strokeWidth="2" />}
          {collar === 2 && (
            <g>
              <path d="M80 120 L100 142 L120 120 L126 126 L100 152 L74 126 Z" fill="#ffffff" stroke={dark} strokeWidth="2.5" />
              <rect x="94" y="142" width="12" height="14" fill="#ffffff" stroke={dark} strokeWidth="2" />
            </g>
          )}

          {/* neck */}
          <path d="M88 96 L88 128 C88 136 112 136 112 128 L112 96 Z" fill={skin} stroke={dark} strokeWidth="2.5" />
          <path d="M88 108 C94 116 106 116 112 108 L112 122 C106 128 94 128 88 122 Z" fill="#000000" opacity="0.14" />

          {/* head */}
          <ellipse cx="100" cy="66" rx="34" ry="39" fill={skin} stroke={dark} strokeWidth="3" />
          {/* ears */}
          <ellipse cx="66" cy="70" rx="6" ry="9" fill={skin} stroke={dark} strokeWidth="2.5" />
          <ellipse cx="134" cy="70" rx="6" ry="9" fill={skin} stroke={dark} strokeWidth="2.5" />

          {/* hair */}
          {hairStyle === 0 && <path d="M68 52 C72 30 128 30 132 52 C132 42 126 32 100 30 C74 32 68 42 68 52 Z" fill={hairC} stroke={dark} strokeWidth="2" />}
          {hairStyle === 1 && <path d="M66 58 C66 30 134 30 134 58 C134 40 122 28 100 28 C78 28 66 40 66 58 Z" fill={hairC} stroke={dark} strokeWidth="2.5" />}
          {hairStyle === 2 && (
            <path d="M66 60 C64 32 100 24 120 32 C134 38 136 50 134 60 C130 42 118 36 104 38 C84 40 70 48 66 60 Z" fill={hairC} stroke={dark} strokeWidth="2.5" />
          )}
          {hairStyle === 3 && (
            <g fill={hairC} stroke={dark} strokeWidth="2">
              <circle cx="78" cy="38" r="11" />
              <circle cx="94" cy="30" r="12" />
              <circle cx="112" cy="32" r="11" />
              <circle cx="126" cy="42" r="10" />
              <circle cx="68" cy="48" r="9" />
            </g>
          )}
          {hairStyle === 4 && (
            <path d="M64 56 C62 28 138 28 136 56 L140 116 C140 124 128 124 128 114 L128 60 C120 44 80 44 72 60 L72 114 C72 124 60 124 60 116 Z" fill={hairC} stroke={dark} strokeWidth="2.5" />
          )}
          {hairStyle === 5 && <rect x="90" y="22" width="20" height="22" rx="6" fill={hairC} stroke={dark} strokeWidth="2.5" />}
          {hairStyle === 6 && <path d="M74 42 C80 34 120 34 126 42 C120 38 80 38 74 42 Z" fill="#ffffff" opacity="0.25" />}
          {hairStyle === 7 && (
            <path d="M68 48 L76 28 L84 44 L92 24 L100 42 L108 24 L116 44 L124 28 L132 48 C122 38 78 38 68 48 Z" fill={hairC} stroke={dark} strokeWidth="2" />
          )}

          {/* headband */}
          {band && <rect x="66" y="44" width="68" height="9" rx="4" fill="#e8e8e8" stroke={dark} strokeWidth="2" />}

          {/* eyebrows */}
          <rect x="76" y="57" width="16" height="4.5" rx="2" fill={dark} transform="rotate(-6 84 59)" />
          <rect x="108" y="57" width="16" height="4.5" rx="2" fill={dark} transform="rotate(6 116 59)" />
          {/* eyes */}
          <ellipse cx="85" cy="68" rx="7" ry="5.5" fill="#ffffff" stroke={dark} strokeWidth="1.6" />
          <ellipse cx="115" cy="68" rx="7" ry="5.5" fill="#ffffff" stroke={dark} strokeWidth="1.6" />
          <circle cx="86" cy="68" r="3" fill={dark} />
          <circle cx="114" cy="68" r="3" fill={dark} />
          <circle cx="87" cy="67" r="1" fill="#ffffff" />
          <circle cx="115" cy="67" r="1" fill="#ffffff" />
          {/* nose */}
          <path d="M100 70 C99 76 97 79 95 81 C98 83.5 102 83.5 105 81 C103 79 101 76 100 70 Z" fill="#000000" opacity="0.16" />
          {/* mouth */}
          <path d="M90 90 C96 95 104 95 110 90" fill="none" stroke={dark} strokeWidth="2.6" strokeLinecap="round" />

          {/* beard */}
          {beard === 1 && <path d="M72 74 C74 96 86 104 100 104 C114 104 126 96 128 74 C128 96 118 110 100 110 C82 110 72 96 72 74 Z" fill={dark} opacity="0.22" />}
          {beard === 2 && <path d="M90 92 C90 102 110 102 110 92 C112 106 106 112 100 112 C94 112 88 106 90 92 Z" fill={hairC} stroke={dark} strokeWidth="1.5" />}
          {beard === 3 && (
            <path d="M70 70 C70 98 82 112 100 112 C118 112 130 98 130 70 L130 84 C130 104 116 118 100 118 C84 118 70 104 70 84 Z" fill={hairC} stroke={dark} strokeWidth="1.6" />
          )}

          {/* lighting */}
          <ellipse cx="70" cy="36" rx="52" ry="30" fill="#ffffff" opacity="0.07" />
          <path d="M0 150 H200 V200 H0 Z" fill="#000000" opacity="0.15" />
        </g>
        <circle cx="100" cy="100" r="97" fill="none" stroke={dark} strokeWidth="2" opacity="0.35" />
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

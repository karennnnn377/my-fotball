import { ButtonHTMLAttributes, ReactNode } from "react";
import { DIFFICULTY_CONFIG, DiffKey } from "../engine/types";

/* ============ sound (tiny WebAudio synth, no assets) ============ */
let ctx: AudioContext | null = null;
let muted = typeof localStorage !== "undefined" && localStorage.getItem("mdl-muted") === "1";

function ensureCtx() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      ctx = null;
    }
  }
  return ctx;
}
function tone(freq: number, dur: number, type: OscillatorType, when = 0, gain = 0.08) {
  const c = ensureCtx();
  if (!c || muted) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(gain, c.currentTime + when);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + when + dur);
  o.connect(g).connect(c.destination);
  o.start(c.currentTime + when);
  o.stop(c.currentTime + when + dur);
}
export const sfx = {
  click: () => tone(520, 0.07, "square", 0, 0.045),
  correct: () => { tone(523, 0.12, "square", 0, 0.06); tone(659, 0.12, "square", 0.09, 0.06); tone(784, 0.2, "square", 0.18, 0.06); },
  wrong: () => { tone(196, 0.16, "sawtooth", 0, 0.05); tone(147, 0.24, "sawtooth", 0.12, 0.05); },
  fanfare: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, "square", i * 0.11, 0.06)); },
  get muted() { return muted; },
  toggle() {
    muted = !muted;
    localStorage.setItem("mdl-muted", muted ? "1" : "0");
    return muted;
  },
};

/* ============ inline icons (original) ============ */
export function BallIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10.5" fill="#f4f8ff" stroke="#0b1c3a" strokeWidth="1.6" />
      <path d="M12 7.2 L16.4 10.4 L14.7 15.6 L9.3 15.6 L7.6 10.4 Z" fill="#0b1c3a" />
      <path d="M12 7.2 L12 2.4 M16.4 10.4 L21 8.8 M14.7 15.6 L17.6 20.2 M9.3 15.6 L6.4 20.2 M7.6 10.4 L3 8.8" stroke="#0b1c3a" strokeWidth="1.5" />
    </svg>
  );
}
export function FlameIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 2 C12 7 17 8.5 17 13.5 A5 5 0 0 1 7 13.5 C7 10.5 8.5 9 9.5 7 C10.2 8.2 11 8.6 11 10.5 C12.5 9 12 5 12 2 Z" fill="#ff9f1c" stroke="#b81f30" strokeWidth="1.2" />
      <path d="M12 21.5 A3.2 3.2 0 0 1 8.8 18.3 C8.8 16.5 10.5 15.6 12 13.5 C13.5 15.6 15.2 16.5 15.2 18.3 A3.2 3.2 0 0 1 12 21.5 Z" fill="#ffd257" />
    </svg>
  );
}
export function TrophyIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M6 3 H18 V9 A6 6 0 0 1 6 9 Z" fill="#ffd257" stroke="#8a5b00" strokeWidth="1.4" />
      <path d="M6 4 H3 V7 A4 4 0 0 0 6.5 10.8 M18 4 H21 V7 A4 4 0 0 1 17.5 10.8" fill="none" stroke="#8a5b00" strokeWidth="1.4" />
      <path d="M10 14.5 H14 V17 H10 Z M7 17 H17 V20 H7 Z" fill="#ffd257" stroke="#8a5b00" strokeWidth="1.4" />
    </svg>
  );
}
export function CheckIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M4 12.5 L9.5 18 L20 6.5" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M5 5 L19 19 M19 5 L5 19" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}
export function ArrowIcon({ size = 18, dir = "left" }: { size?: number; dir?: "left" | "right" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ transform: dir === "right" ? "rotate(180deg)" : undefined }}>
      <path d="M15 4 L7 12 L15 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ============ difficulty badge ============ */
export function DifficultyBadge({ diff, label, small = false }: { diff: DiffKey | "random"; label?: string; small?: boolean }) {
  const meta = diff === "random"
    ? { label: label || "RANDOM", color: "#f7b32b", deep: "#7c4a03" }
    : DIFFICULTY_CONFIG[diff];
  return (
    <span
      className={`display inline-flex items-center gap-1.5 rounded-[4px] text-white ${small ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-sm"}`}
      style={{
        background: `linear-gradient(180deg, ${meta.color}, ${meta.color}cc)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -2px 0 rgba(0,0,0,0.3), 0 3px 8px rgba(2,6,20,0.5)`,
        textShadow: "0 1px 2px rgba(0,0,0,0.55)",
        border: "1px solid rgba(255,255,255,0.3)",
      }}
    >
      {diff === "impossible" && <FlameIcon size={small ? 11 : 14} />}
      {meta.label}
    </span>
  );
}

/* ============ glossy game button ============ */
interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;
  shadowBottom?: string;
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}
export function GameButton({ color = "#0aa05b", shadowBottom, size = "md", children, className = "", style, ...rest }: GameButtonProps) {
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-md",
    md: "px-6 py-3 text-base rounded-lg",
    lg: "px-8 py-4 text-xl rounded-xl",
  };
  return (
    <button
      className={`btn-game text-white ${sizes[size]} ${className}`}
      style={{
        background: `linear-gradient(180deg, ${color}, ${color}d0)`,
        ["--shadow-bottom" as string]: shadowBottom || shade(color),
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
function shade(hex: string): string {
  // darken a hex color for the bevel bottom
  const m = hex.replace("#", "");
  if (m.length < 6) return "#0a3a20";
  const n = parseInt(m.slice(0, 6), 16);
  const f = (v: number) => Math.max(0, Math.round(v * 0.45));
  const r = f((n >> 16) & 255), g = f((n >> 8) & 255), b = f(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/* ============ stat plate ============ */
export function StatPlate({ label, value, accent }: { label: string; value: ReactNode; accent?: string }) {
  return (
    <div className="plate rounded-lg px-3 py-2 text-center">
      <div className="display text-[10px] tracking-[0.14em] text-ink-dim">{label}</div>
      <div className="display text-xl font-semibold" style={{ color: accent || "var(--color-gold-400)" }}>
        {value}
      </div>
    </div>
  );
}

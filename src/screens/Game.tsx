import { useEffect, useState, type CSSProperties } from "react";
import confetti from "canvas-confetti";
import {
  DIFFICULTY_CONFIG, DIFF_ORDER, DiffKey, GameResult, GuessChallenge, Mode, Question,
  ROUNDS_PER_GAME, RoundResult, STREAK_BONUS_MAX_STEPS, STREAK_BONUS_STEP_PCT,
} from "../engine/types";
import {
  clubById, getRandomChallenge, getRandomQuestion, playerById, resolveRandomDifficulty, shuffle, teamById,
} from "../engine/engine";
import Crest from "../ui/Crest";
import Portrait from "../ui/Portrait";
import {
  ArrowIcon, BallIcon, CheckIcon, DifficultyBadge, FlameIcon, GameButton, MuteToggle, StatPlate, XIcon, getBest, saveBest, sfx,
} from "../ui/Chrome";

interface RoundData {
  difficulty: DiffKey;
  question?: Question;
  options?: string[];
  answerIdx?: number;
  challenge?: GuessChallenge;
  optionIds?: string[];
}

function makeRound(mode: Mode, difficulty: DiffKey | "random"): RoundData {
  const d = difficulty === "random" ? resolveRandomDifficulty() : difficulty;
  if (mode === "quiz") {
    const q = getRandomQuestion(d);
    const order = shuffle([0, 1, 2, 3]); // Fisher–Yates: uniform answer order
    return {
      difficulty: d,
      question: q,
      options: order.map((i) => q.options[i]),
      answerIdx: order.indexOf(q.answer),
    };
  }
  const ch = getRandomChallenge(mode === "national" ? "national" : "club", d);
  const ids = shuffle([ch.teamId, ...ch.distractorIds]); // uniform crest order
  return { difficulty: d, challenge: ch, optionIds: ids };
}

function CountUp({ value }: { value: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 900;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setV(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{v.toLocaleString()}</>;
}

const LETTERS = ["A", "B", "C", "D"];

/* real hex values for confetti (CSS vars can't be parsed by canvas) */
const DIFF_HEX: Record<DiffKey, string> = {
  easy: "#22c55e", medium: "#38bdf8", hard: "#f59e0b", extremeHard: "#ef4444", impossible: "#c026d3",
};

export default function GameScreen({
  mode, difficulty, onExit, onPlayAgain, onChangeDifficulty, onMenu,
}: {
  mode: Mode;
  difficulty: DiffKey | "random";
  onExit: () => void;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
  onMenu: () => void;
}) {
  const [round, setRound] = useState(0);
  const [data, setData] = useState<RoundData | null>(null);
  const [choice, setChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [scoreKey, setScoreKey] = useState(0);
  /* Random Difficulty roulette: a level is rolled FIRST (with a spin),
     then ONLY that level's dedicated pool is used (spec #33 / #46). */
  const [locked, setLocked] = useState(false);
  const [spinDiff, setSpinDiff] = useState<DiffKey | null>(null);

  useEffect(() => {
    if (round >= ROUNDS_PER_GAME) return;
    setChoice(null);
    if (difficulty === "random") {
      setLocked(true);
      setData(null);
      const rolled = resolveRandomDifficulty();
      // spin across the ladder, always land on the pre-rolled pool
      const cycle = shuffle([...DIFF_ORDER, ...DIFF_ORDER, rolled]);
      let i = 0;
      setSpinDiff(cycle[0]);
      sfx.tick();
      const iv = window.setInterval(() => {
        i++;
        if (i < cycle.length) {
          setSpinDiff(cycle[i]);
          sfx.tick();
        } else {
          window.clearInterval(iv);
          setSpinDiff(rolled);
          sfx.roll();
          setData(makeRound(mode, rolled));
          setLocked(false);
        }
      }, 78);
      return () => window.clearInterval(iv);
    }
    setSpinDiff(null);
    setData(makeRound(mode, difficulty));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, mode, difficulty]);

  /* personal best — recorded once at full time */
  const [newBest, setNewBest] = useState(false);
  const [prevBest, setPrevBest] = useState(0);
  useEffect(() => {
    if (round >= ROUNDS_PER_GAME) {
      setPrevBest(getBest(mode, difficulty));
      setNewBest(saveBest(mode, difficulty, score));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  /* full-time confetti when it was a great match */
  useEffect(() => {
    if (round < ROUNDS_PER_GAME) return;
    const cnt = results.filter((r) => r.correct).length;
    if (cnt < 7 && !newBest) return;
    const gold = ["#ffd257", "#f7b32b", "#f4f8ff", "#17c964"];
    const timers = [
      window.setTimeout(() => confetti({ particleCount: 130, spread: 85, origin: { y: 0.32 }, colors: gold, zIndex: 60, disableForReducedMotion: true }), 120),
      window.setTimeout(() => confetti({ particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.65 }, colors: gold, zIndex: 60, disableForReducedMotion: true }), 420),
      window.setTimeout(() => confetti({ particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.65 }, colors: gold, zIndex: 60, disableForReducedMotion: true }), 640),
    ];
    return () => timers.forEach((t) => clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, newBest]);

  /* keyboard play: 1-4 / A-D to answer, Enter/Space for next round */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (round >= ROUNDS_PER_GAME) {
        if (e.key === "Enter") { sfx.fanfare(); onPlayAgain(); }
        return;
      }
      if (e.key.toLowerCase() === "m") {
        sfx.toggle();
        window.dispatchEvent(new Event("mdl-mute"));
        return;
      }
      if (!data || locked) return;
      if (choice === null) {
        const map: Record<string, number> = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 };
        const k = e.key.toLowerCase();
        const total = data.options?.length ?? data.optionIds?.length ?? 0;
        if (k in map && map[k] < total) answer(map[k]);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const revealed = choice !== null;
  const isLast = round >= ROUNDS_PER_GAME - 1;
  const correct = revealed && data
    ? (data.question ? choice === data.answerIdx : data.optionIds![choice] === data.challenge!.teamId)
    : false;

  const answer = (i: number) => {
    if (revealed || locked || !data) return;
    setChoice(i);
    const ok = data.question ? i === data.answerIdx : data.optionIds![i] === data.challenge!.teamId;
    const base = DIFFICULTY_CONFIG[data.difficulty].points;
    // streak bonus: +10% of base per straight correct already banked, capped at +50%
    const bonus = ok ? Math.round((base * Math.min(streak, STREAK_BONUS_MAX_STEPS) * STREAK_BONUS_STEP_PCT) / 100) : 0;
    const pts = ok ? base + bonus : 0;
    if (ok) {
      sfx.correct();
      confetti({
        particleCount: 80, spread: 72, startVelocity: 36, origin: { y: 0.38 },
        colors: [DIFF_HEX[data.difficulty], "#ffd257", "#ffffff"], zIndex: 60, disableForReducedMotion: true,
      });
      setScore((s) => s + pts);
      setStreak((s) => {
        const ns = s + 1;
        setBest((b) => Math.max(b, ns));
        return ns;
      });
      setScoreKey((k) => k + 1);
    } else {
      sfx.wrong();
      setStreak(0);
    }
    setResults((r) => [...r, { correct: ok, questionId: data.question?.id || data.challenge!.id, difficulty: data.difficulty, points: pts, bonus }]);
  };

  const next = () => {
    sfx.click();
    if (isLast) {
      setRound(ROUNDS_PER_GAME); // triggers final
    } else {
      setRound((r) => r + 1);
    }
  };

  /* ================= FULL TIME ================= */
  if (round >= ROUNDS_PER_GAME) {
    const correctCnt = results.filter((r) => r.correct).length;
    const pct = correctCnt / ROUNDS_PER_GAME;
    const title = pct >= 0.9 ? "THE G.O.A.T." : pct >= 0.7 ? "WORLD CLASS" : pct >= 0.5 ? "FIRST TEAM" : pct >= 0.3 ? "SQUAD PLAYER" : "SUNDAY LEAGUE";
    const stars = Math.max(1, Math.round(pct * 5));
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:py-14">
        <div className="glossy-deep anim-pop rounded-2xl p-6 text-center md:p-10">
          <div className="mb-2 flex items-center justify-center gap-2 text-gold-400" style={{ color: "var(--color-gold-400)" }}>
            <BallIcon size={22} />
            <span className="display text-xs tracking-[0.35em]">FULL TIME</span>
            <BallIcon size={22} />
          </div>
          <h1 className="display text-outline text-5xl font-bold text-white md:text-6xl">{title}</h1>
          <div className="mt-3 flex justify-center gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <svg key={i} width="26" height="26" viewBox="0 0 24 24" style={{ opacity: i < stars ? 1 : 0.25 }}>
                <path d="M12 2 L14.8 8.6 L22 9.3 L16.6 14 L18.2 21.5 L12 17.6 L5.8 21.5 L7.4 14 L2 9.3 L9.2 8.6 Z"
                  fill="#ffd257" stroke="#8a5b00" strokeWidth="1" />
              </svg>
            ))}
          </div>
          <div className="display mt-6 text-7xl font-bold text-gold-400 md:text-8xl" style={{ color: "var(--color-gold-400)", textShadow: "0 4px 0 rgba(2,6,20,0.8)" }}>
            <CountUp value={score} />
          </div>
          <div className="display text-[11px] tracking-[0.3em] text-ink-dim">POINTS</div>
          <div className="display mt-1 h-5 text-[11px] tracking-[0.3em] text-ink-dim">
            {newBest ? (
              <span className="anim-pop inline-block font-bold text-gold-400" style={{ color: "var(--color-gold-400)" }}>★ NEW PERSONAL BEST ★</span>
            ) : prevBest > 0 ? (
              <span>PERSONAL BEST {prevBest.toLocaleString()}</span>
            ) : null}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatPlate label="CORRECT" value={`${results.filter((r) => r.correct).length}/${ROUNDS_PER_GAME}`} accent="var(--color-win)" />
            <StatPlate label="WRONG" value={results.length - results.filter((r) => r.correct).length} accent="var(--color-lose)" />
            <StatPlate label="BEST STREAK" value={<span className="inline-flex items-center gap-1"><FlameIcon size={16} />{best}</span>} />
            <StatPlate label="MODE" value={<span className="text-sm leading-tight">{mode === "quiz" ? "QUIZ" : mode === "national" ? "NATIONS" : "CLUBS"}</span>} accent="#8fb8ee" />
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-1.5">
            {results.map((r, i) => (
              <span key={i} className="rounded-md px-2 py-1 text-[11px] font-bold text-white"
                style={{
                  background: r.correct ? "var(--color-win-deep)" : "var(--color-lose-deep)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderBottom: `3px solid ${DIFF_HEX[r.difficulty]}`,
                }}
                title={`${DIFFICULTY_CONFIG[r.difficulty].label} — ${r.correct ? `+${r.points}` : "0 pts"}`}>
                {i + 1}{r.correct ? " ✓" : " ✕"}
              </span>
            ))}
          </div>
          {difficulty === "random" && (
            <p className="display mt-3 text-[10px] tracking-[0.2em] text-ink-dim">
              CHIP EDGES SHOW EACH ROUND'S ROLLED DIFFICULTY
            </p>
          )}

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <GameButton color="#0aa05b" onClick={() => { sfx.fanfare(); onPlayAgain(); }}>PLAY AGAIN</GameButton>
            <GameButton color="#2757a8" onClick={onChangeDifficulty}>CHANGE DIFFICULTY</GameButton>
            <GameButton color="#5a6b8c" shadowBottom="#2b3448" onClick={onMenu}>MAIN MENU</GameButton>
          </div>
        </div>
      </div>
    );
  }

  const lastBonus = results.length ? results[results.length - 1].bonus ?? 0 : 0;

  /* ================= HUD ================= */
  const hud = (
    <div className="mx-auto mb-5 w-full max-w-4xl px-4">
      <div className="glossy flex flex-wrap items-center gap-3 rounded-xl px-4 py-3">
        <button onClick={() => { sfx.click(); onExit(); }} className="flex items-center gap-1.5 text-ink-dim transition-colors hover:text-white" title="Back to menu">
          <ArrowIcon size={16} />
          <span className="display text-[11px] tracking-[0.2em]">MENU</span>
        </button>
        <span className="hidden h-6 w-px bg-pitch-line/25 sm:block" />
        <span className="display text-xs tracking-[0.2em] text-ink-dim">
          {mode === "quiz" ? "FOOTBALL QUIZ" : mode === "national" ? "GUESS THE NATION" : "GUESS THE CLUB"}
        </span>
        <span className={difficulty === "random" && locked ? "anim-flame inline-block" : "inline-block"}>
          <DifficultyBadge diff={difficulty === "random" ? (spinDiff ?? data?.difficulty ?? "easy") : difficulty} small />
        </span>
        {difficulty === "random" && (
          <span className="display rounded bg-pitch-900/80 px-2 py-0.5 text-[10px] tracking-widest text-gold-400" style={{ color: "var(--color-gold-400)" }}>
            {locked ? "ROLLING" : "ROLLED"}
          </span>
        )}

        <div className="ml-auto flex items-center gap-3">
          {/* progress segments */}
          <div className="flex items-center gap-1" title={`Round ${Math.min(round + 1, ROUNDS_PER_GAME)} of ${ROUNDS_PER_GAME}`}>
            {Array.from({ length: ROUNDS_PER_GAME }).map((_, i) => {
              const r = results[i];
              const bg = r ? (r.correct ? "var(--color-win)" : "var(--color-lose)") : i === round ? "var(--color-gold-400)" : "rgba(143,184,238,0.25)";
              return <span key={i} className="h-2.5 w-4 rounded-sm" style={{ background: bg, boxShadow: i === round && !r ? "0 0 8px rgba(255,210,87,0.7)" : undefined }} />;
            })}
          </div>
          <span key={scoreKey} className={scoreKey ? "anim-score display text-xl font-bold text-gold-400" : "display text-xl font-bold text-gold-400"} style={{ color: "var(--color-gold-400)", minWidth: 64, textAlign: "right" }}>
            {score.toLocaleString()}
          </span>
          {streak >= 2 && (
            <span
              className="anim-flame inline-flex items-center gap-0.5 rounded-md bg-pitch-900/80 px-2 py-1 text-sm font-bold text-orange-300"
              style={{ color: "#ffb84d" }}
              title={`Streak bonus on next correct answer: +${Math.min(streak, STREAK_BONUS_MAX_STEPS) * STREAK_BONUS_STEP_PCT}%`}
            >
              <FlameIcon size={15} />{streak}
            </span>
          )}
          <MuteToggle size="sm" />
        </div>
      </div>
    </div>
  );

  /* ============ RANDOM DIFFICULTY ROULETTE (between rounds) ============ */
  if (locked || !data) {
    return (
      <div className="w-full pb-10">
        {hud}
        <div className="mx-auto w-full max-w-3xl px-4">
          <div className="glossy-deep anim-rise rounded-2xl p-8 text-center md:p-12">
            <div className="display mb-5 text-[11px] tracking-[0.35em] text-ink-dim">DIFFICULTY ROULETTE</div>
            <div key={spinDiff ?? "idle"} className="anim-pop inline-block">
              <DifficultyBadge diff={spinDiff ?? "easy"} />
            </div>
            <div className="mx-auto mt-7 h-2 w-60 max-w-full overflow-hidden rounded-full border border-pitch-line/25 bg-pitch-900">
              <div className="anim-roulette-bar h-full rounded-full" style={{ background: "linear-gradient(90deg, #22c55e, #38bdf8, #f59e0b, #ef4444, #c026d3)" }} />
            </div>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-ink-dim">
              A difficulty is rolled <span className="font-semibold text-white">first</span> — then only{" "}
              <span className="font-semibold text-white">that level's dedicated pool</span> supplies the{" "}
              {mode === "quiz" ? "question" : "challenge"}. Fair chaos.
            </p>
          </div>
        </div>
      </div>
    );
  }
  const meta = DIFFICULTY_CONFIG[data.difficulty];

  /* ================= QUIZ ================= */
  if (mode === "quiz" && data.question) {
    const q = data.question;
    return (
      <div className="w-full pb-10">
        {hud}
        <div className="mx-auto w-full max-w-3xl px-4">
          <div key={round} className="glossy-deep anim-rise rounded-2xl p-6 md:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="display rounded bg-pitch-700 px-2.5 py-1 text-[11px] tracking-[0.2em] text-ink-dim border border-pitch-line/20">
                {q.category.toUpperCase()}
              </span>
              <span className="display text-[11px] tracking-[0.2em] text-ink-dim">ROUND {round + 1} / {ROUNDS_PER_GAME}</span>
              <span className="ml-auto display text-[11px] tracking-[0.2em]" style={{ color: meta.color }}>WORTH {meta.points} PTS</span>
            </div>
            <h2 className="display text-2xl font-semibold leading-snug text-white md:text-3xl">{q.text}</h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {data.options!.map((opt, i) => {
                let cls = "answer-card glossy plate";
                let style: CSSProperties = {};
                if (revealed) {
                  if (i === data.answerIdx) {
                    cls += " !border-[rgba(23,201,100,0.9)]";
                    style = { background: "linear-gradient(180deg, rgba(23,201,100,0.35), rgba(10,143,71,0.5)), #0c4a2e", boxShadow: "0 0 22px rgba(23,201,100,0.35), inset 0 1px 0 rgba(255,255,255,0.25)" };
                  } else if (i === choice) {
                    cls += " anim-shake !border-[rgba(255,77,94,0.9)]";
                    style = { background: "linear-gradient(180deg, rgba(255,77,94,0.3), rgba(184,31,48,0.5)), #5c1018", boxShadow: "0 0 22px rgba(255,77,94,0.3)" };
                  } else {
                    style = { opacity: 0.45 };
                  }
                }
                return (
                  <button key={i} disabled={revealed} onClick={() => answer(i)} className={`${cls} flex items-center gap-3 rounded-xl px-4 py-3.5 text-left`} style={style}>
                    <span className="display grid h-8 w-8 shrink-0 place-items-center rounded-md bg-pitch-900/90 text-sm text-gold-400 border border-pitch-line/25" style={{ color: "var(--color-gold-400)" }}>
                      {LETTERS[i]}
                    </span>
                    <span className="min-w-0 flex-1 text-[15px] font-semibold text-white">{opt}</span>
                    {revealed && i === data.answerIdx && <span className="text-win"><CheckIcon size={22} /></span>}
                    {revealed && i === choice && i !== data.answerIdx && <span className="text-lose"><XIcon size={22} /></span>}
                  </button>
                );
              })}
            </div>

            {revealed && (
              <RevealFooter
                correct={correct}
                points={correct ? results[results.length - 1]?.points ?? meta.points : 0}
                bonus={lastBonus}
                explanation={q.explanation}
                isLast={isLast}
                onNext={next}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ================= GUESS MODES ================= */
  const ch = data.challenge!;
  const team = ch.type === "national" ? teamById.get(ch.teamId)! : clubById.get(ch.teamId)!;
  const players = ch.playerIds.map((id) => playerById.get(id)!);
  const color = ch.type === "national" ? team.c1 : (team as { c1: string }).c1;

  return (
    <div className="w-full pb-10">
      {hud}
      <div className="mx-auto w-full max-w-4xl px-4">
        <div key={round} className="glossy-deep anim-rise rounded-2xl p-5 md:p-8">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="display rounded bg-pitch-700 px-2.5 py-1 text-[11px] tracking-[0.2em] text-ink-dim border border-pitch-line/20">
              {ch.type === "national" ? "INTERNATIONAL DUTY" : "CLUB CAREER"}
            </span>
            <span className="display text-[11px] tracking-[0.2em] text-ink-dim">ROUND {round + 1} / {ROUNDS_PER_GAME}</span>
            <span className="ml-auto display text-[11px] tracking-[0.2em]" style={{ color: meta.color }}>WORTH {meta.points} PTS</span>
          </div>
          <h2 className="display text-xl font-semibold leading-snug text-white md:text-2xl">
            {ch.type === "national" ? "These players all represented one national team. Which one?" : "These players all played for one club. Which one?"}
          </h2>

          {/* player lineup */}
          <div className="relative mt-5 overflow-hidden rounded-xl border border-pitch-line/20"
            style={{ background: "linear-gradient(180deg, #0e5c33, #0a4527 60%, #083a20)" }}>
            <div className="pointer-events-none absolute inset-0 opacity-25"
              style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 44px, transparent 44px 88px)" }} />
            <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/20" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/20" />
            <div className="relative flex flex-wrap items-end justify-center gap-3 px-4 py-5 md:gap-6">
              {players.map((p, i) => (
                /* mystery before the answer: neutral silhouette, NO team colours (spec #27).
                   On reveal the card flips to the full-colour game portrait. */
                <div key={`${p.id}-${revealed ? "rev" : "hid"}`} className="anim-pop" style={{ animationDelay: `${i * (revealed ? 70 : 110)}ms` }}>
                  <Portrait player={p} color={color} size={88} showName mystery={!revealed} />
                </div>
              ))}
            </div>
            {!revealed && (
              <div className="display relative pb-3 text-center text-[10px] tracking-[0.28em] text-gold-300" style={{ color: "var(--color-gold-300)" }}>
                FACES HIDDEN — THE NAMES ARE YOUR ONLY CLUE
              </div>
            )}
          </div>

          {/* crest options */}
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {data.optionIds!.map((id, i) => {
              const t = ch.type === "national" ? teamById.get(id)! : clubById.get(id)!;
              const isCorrect = id === ch.teamId;
              const isPick = data.optionIds![choice ?? -1] === id;
              let style: CSSProperties = {};
              let cls = "answer-card glossy";
              if (revealed) {
                if (isCorrect) {
                  style = { boxShadow: "0 0 24px rgba(23,201,100,0.5), inset 0 1px 0 rgba(255,255,255,0.25)", borderColor: "rgba(23,201,100,0.95)", background: "linear-gradient(180deg, rgba(23,201,100,0.28), rgba(10,143,71,0.35)), #0c4a2e" };
                } else if (isPick) {
                  cls += " anim-shake";
                  style = { boxShadow: "0 0 24px rgba(255,77,94,0.45)", borderColor: "rgba(255,77,94,0.95)", background: "linear-gradient(180deg, rgba(255,77,94,0.25), rgba(184,31,48,0.4)), #5c1018" };
                } else {
                  style = { opacity: 0.4 };
                }
              }
              return (
                <button key={id} disabled={revealed} onClick={() => answer(i)} className={`${cls} anim-rise relative flex flex-col items-center gap-1.5 rounded-xl px-3 py-4`} style={{ ...style, animationDelay: `${i * 70}ms` }}>
                  <Crest id={t.id} name={t.name} code={t.code} c1={t.c1} c2={t.c2} size={76} />
                  <span className="display text-center text-sm font-semibold leading-tight text-white">{t.name}</span>
                  {revealed && isCorrect && <span className="absolute right-2 top-2 text-win"><CheckIcon size={20} /></span>}
                  {revealed && isPick && !isCorrect && <span className="absolute right-2 top-2 text-lose"><XIcon size={20} /></span>}
                </button>
              );
            })}
          </div>

          {/* reveal */}
          {revealed && (
            <div className="anim-rise mt-6 rounded-xl border border-pitch-line/25 bg-pitch-900/70 p-5">
              <div className={`anim-stamp display mb-4 inline-block rounded-lg border-4 px-5 py-2 text-3xl font-bold md:text-4xl ${correct ? "text-win" : "text-lose"}`}
                style={{ borderColor: correct ? "var(--color-win)" : "var(--color-lose)", textShadow: "0 3px 0 rgba(2,6,20,0.8)" }}>
                {correct ? "CORRECT!" : "INCORRECT!"}
              </div>
              <div className="flex flex-col items-center gap-5 md:flex-row md:items-start">
                <div className="flex shrink-0 flex-col items-center gap-2">
                  <span className="display text-[10px] tracking-[0.25em] text-ink-dim">{correct ? "THE ANSWER" : "THE CORRECT ANSWER"}</span>
                  <div className="anim-pop rounded-xl bg-pitch-800/80 p-3 border border-pitch-line/25">
                    <Crest id={team.id} name={team.name} code={team.code} c1={team.c1} c2={team.c2} size={110} />
                  </div>
                  <span className="display text-xl font-bold text-gold-400" style={{ color: "var(--color-gold-400)" }}>{team.name}</span>
                  {correct && (
                    <span className="anim-pop display rounded-md bg-pitch-900 px-3 py-1 text-lg text-win" style={{ animationDelay: "250ms" }}>
                      +{results[results.length - 1]?.points ?? meta.points} PTS
                      {lastBonus > 0 && (
                        <span className="ml-2 text-[11px] tracking-wider text-gold-400" style={{ color: "var(--color-gold-400)" }}>
                          INCL. +{lastBonus} STREAK
                        </span>
                      )}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="display mb-2 text-[11px] tracking-[0.25em] text-ink-dim">
                    SQUAD REVEAL — {ch.type === "national" ? `ALL CAPPED BY ${team.name.toUpperCase()}` : `ALL PLAYED FOR ${team.name.toUpperCase()}`}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {players.map((p, i) => (
                      <div key={p.id} className="anim-pop flex flex-col items-center" style={{ animationDelay: `${120 + i * 90}ms` }}>
                        <Portrait player={p} color={color} size={64} showName />
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ink-dim">
                    {players.map((p) => p.name).join(", ")} {ch.type === "national" ? `all represented ${team.name} at international level.` : `all played for ${team.name} during their careers.`}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <GameButton color={isLast ? "#f7b32b" : "#0aa05b"} shadowBottom={isLast ? "#7c4a03" : undefined} onClick={next}>
                  {isLast ? "FULL TIME" : "NEXT ROUND"}
                </GameButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* shared quiz reveal footer */
function RevealFooter({
  correct, points, bonus, explanation, isLast, onNext,
}: { correct: boolean; points: number; bonus?: number; explanation?: string; isLast: boolean; onNext: () => void }) {
  return (
    <div className="anim-rise mt-6 rounded-xl border border-pitch-line/25 bg-pitch-900/70 p-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`display rounded-md px-4 py-1.5 text-2xl font-bold ${correct ? "bg-pitch-900 text-win" : "bg-pitch-900 text-lose"}`}
          style={{ border: `3px solid ${correct ? "var(--color-win)" : "var(--color-lose)"}`, textShadow: "0 2px 0 rgba(2,6,20,0.8)" }}>
          {correct ? "CORRECT!" : "INCORRECT!"}
        </span>
        {correct && (
          <span className="display text-lg text-win">
            +{points} PTS
            {bonus ? (
              <span className="ml-2 align-middle text-[11px] tracking-wider text-gold-400" style={{ color: "var(--color-gold-400)" }}>
                INCL. +{bonus} STREAK BONUS
              </span>
            ) : null}
          </span>
        )}
        <div className="ml-auto">
          <GameButton color={isLast ? "#f7b32b" : "#0aa05b"} shadowBottom={isLast ? "#7c4a03" : undefined} onClick={onNext}>
            {isLast ? "FULL TIME" : "NEXT ROUND"}
          </GameButton>
        </div>
      </div>
      {explanation && <p className="mt-3 text-sm leading-relaxed text-ink-dim">{explanation}</p>}
    </div>
  );
}

export type { GameResult };

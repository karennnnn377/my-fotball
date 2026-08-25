import { DiffKey, Question, QuestionTuple } from "../engine/types";
import { EASY_QS } from "./questions/q-easy";
import { MEDIUM_QS } from "./questions/q-medium";
import { HARD_QS } from "./questions/q-hard";
import { EXTREME_HARD_QS } from "./questions/q-extreme-hard";
import { IMPOSSIBLE_QS } from "./questions/q-impossible";

/* ============================================================
   CURATED QUESTION DATABASE
   Five fully separated pools — one per difficulty level.
   A question written for EASY can never surface at IMPOSSIBLE
   (or any other level): difficulty is assigned at authoring
   time, never after the fact.

     EASY         100+ questions
     MEDIUM       100+ questions
     HARD         100+ questions
     EXTREME HARD 100+ questions
     IMPOSSIBLE   100+ questions

   Total: 500+ curated questions, each with a verifiable answer.
   ============================================================ */

function toQuestion(d: DiffKey, t: QuestionTuple, i: number): Question {
  return {
    id: `${d}-curated-${i}`,
    text: t[0],
    options: t[1],
    answer: t[2],
    category: t[3],
    difficulty: d,
    explanation: t[4],
  };
}

export const HANDCRAFTED: Record<DiffKey, Question[]> = {
  easy: EASY_QS.map((t, i) => toQuestion("easy", t, i)),
  medium: MEDIUM_QS.map((t, i) => toQuestion("medium", t, i)),
  hard: HARD_QS.map((t, i) => toQuestion("hard", t, i)),
  extremeHard: EXTREME_HARD_QS.map((t, i) => toQuestion("extremeHard", t, i)),
  impossible: IMPOSSIBLE_QS.map((t, i) => toQuestion("impossible", t, i)),
};

/* Per-pool authored counts (shown on the difficulty screen) */
export const CURATED_COUNTS: Record<DiffKey, number> = {
  easy: EASY_QS.length,
  medium: MEDIUM_QS.length,
  hard: HARD_QS.length,
  extremeHard: EXTREME_HARD_QS.length,
  impossible: IMPOSSIBLE_QS.length,
};

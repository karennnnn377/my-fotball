import {
  Club, DiffKey, GuessChallenge, NationalTeam, Player, Question,
} from "./types";
import { NATIONAL_TEAMS } from "../data/teams";
import { CLUBS } from "../data/clubs";
import { PLAYERS } from "../data/players";
import { HANDCRAFTED } from "../data/questions";

/* ============================================================
   RANDOM HELPERS
============================================================ */
export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
export function pickN<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}
function weightedPick<T>(items: T[], weight: (t: T) => number): T {
  const total = items.reduce((s, i) => s + weight(i), 0);
  let r = Math.random() * total;
  for (const it of items) {
    r -= weight(it);
    if (r <= 0) return it;
  }
  return items[items.length - 1];
}

/* ============================================================
   LOOKUP MAPS
============================================================ */
export const teamById = new Map<string, NationalTeam>(NATIONAL_TEAMS.map((t) => [t.id, t]));
export const clubById = new Map<string, Club>(CLUBS.map((c) => [c.id, c]));
export const playerById = new Map<string, Player>(PLAYERS.map((p) => [p.id, p]));

/* ============================================================
   QUESTION POOLS — one dedicated pool per difficulty.
   A question is ONLY ever drawn from the pool of the selected
   difficulty. Pools = curated questions + verified questions
   derived from the player database (nationality & club history).
============================================================ */
const GEN_CAP_PER_POOL = 150;

function distractorCountries(correct: NationalTeam, n: number): string[] {
  const sameConf = NATIONAL_TEAMS.filter((t) => t.confederation === correct.confederation && t.id !== correct.id);
  const others = NATIONAL_TEAMS.filter((t) => t.confederation !== correct.confederation && t.id !== correct.id);
  const fromConf = pickN(sameConf, Math.min(n, sameConf.length));
  const rest = pickN(others, n - fromConf.length);
  return [...fromConf, ...rest].map((t) => t.name);
}

function distractorClubs(correct: Club, player: Player, n: number, hardMode: boolean): string[] {
  const notHis = CLUBS.filter((c) => c.id !== correct.id && !player.clubIds.includes(c.id));
  let pool = notHis;
  if (hardMode) {
    const sameCountry = notHis.filter((c) => c.country === correct.country);
    if (sameCountry.length >= n) pool = sameCountry;
  }
  return pickN(pool, n).map((c) => c.name);
}

function generateVerifiedQuestions(difficulty: DiffKey): Question[] {
  const tier = { easy: 1, medium: 2, hard: 3, extremeHard: 4, impossible: 5 }[difficulty];
  const players = shuffle(PLAYERS.filter((p) => p.tier === tier));
  const out: Question[] = [];
  const seen = new Set<string>();

  for (const p of players) {
    if (out.length >= GEN_CAP_PER_POOL) break;
    const country = teamById.get(p.countryId);
    if (!country) continue;

    // --- nationality question (verified: countryId is the data fact) ---
    const qText1 = p.era === "modern"
      ? `Which national team does ${p.name} represent?`
      : `Which national team did ${p.name} represent?`;
    if (!seen.has(qText1)) {
      seen.add(qText1);
      const wrong = distractorCountries(country, 3);
      const options = shuffle([country.name, ...wrong]);
      out.push({
        id: `gen-nat-${p.id}`,
        text: qText1,
        options,
        answer: options.indexOf(country.name),
        category: "National Teams",
        difficulty,
        explanation: `${p.name} ${p.era === "modern" ? "represents" : "represented"} ${country.name}${p.position === "GK" ? " in goal" : ""}.`,
      });
    }
    if (out.length >= GEN_CAP_PER_POOL) break;

    // --- club question (verified: clubIds are the data facts) ---
    if (p.clubIds.length > 0) {
      const correct = clubById.get(pick(p.clubIds));
      if (correct) {
        const qText2 = `Which of these clubs did ${p.name} play for?`;
        const key = qText2 + correct.id;
        if (!seen.has(key)) {
          seen.add(key);
          const hardish = tier >= 3;
          const wrong = distractorClubs(correct, p, 3, hardish);
          if (wrong.length === 3) {
            const options = shuffle([correct.name, ...wrong]);
            out.push({
              id: `gen-club-${p.id}-${correct.id}`,
              text: qText2,
              options,
              answer: options.indexOf(correct.name),
              category: "Clubs",
              difficulty,
              explanation: `${p.name} played for ${correct.name}.`,
            });
          }
        }
      }
    }
  }
  return out;
}

export const questionPools: Record<DiffKey, Question[]> = {
  easy: [], medium: [], hard: [], extremeHard: [], impossible: [],
};
(function buildPools() {
  for (const d of ["easy", "medium", "hard", "extremeHard", "impossible"] as DiffKey[]) {
    questionPools[d] = [...HANDCRAFTED[d], ...generateVerifiedQuestions(d)];
  }
})();

/* ============================================================
   SESSION MEMORY — store ids, exclude recent while unused exist
============================================================ */
const recentQuestions: Record<DiffKey, string[]> = {
  easy: [], medium: [], hard: [], extremeHard: [], impossible: [],
};
const HISTORY_LIMIT = 40;
const recentChallenges: string[] = [];

export function resetHistory() {
  for (const d of Object.keys(recentQuestions) as DiffKey[]) recentQuestions[d] = [];
  recentChallenges.length = 0;
}

export function getRandomQuestion(difficulty: DiffKey): Question {
  const pool = questionPools[difficulty];
  if (!pool || pool.length === 0) {
    // Fallback: use medium pool so the game never crashes
    return pick(questionPools.medium);
  }
  const recent = recentQuestions[difficulty];
  let candidates = pool.filter((q) => !recent.includes(q.id));
  if (candidates.length === 0) {
    recent.length = 0; // exhausted -> reset history, never crash
    candidates = pool;
  }
  const q = pick(candidates);
  recent.push(q.id);
  if (recent.length > HISTORY_LIMIT) recent.shift();
  return q;
}

/* ============================================================
   GUESS-CHALLENGE ENGINE
   Each difficulty selects from its own tier range.
   Challenges are validated before display; invalid ones are
   discarded and regenerated.
============================================================ */
const TEAM_TIER_RANGE: Record<DiffKey, number[]> = {
  easy: [1],
  medium: [1, 2],
  hard: [2, 3],
  extremeHard: [2, 3, 4],
  impossible: [3, 4, 5],
};
/* Player obscurity bands — IMPOSSIBLE deliberately digs deeper than
   EXTREME HARD (tier 4-5 only), so the two levels never feel identical. */
const PLAYER_TIER_RANGE: Record<DiffKey, number[]> = {
  easy: [1],
  medium: [1, 2],
  hard: [2, 3],
  extremeHard: [3, 4],
  impossible: [4, 5],
};
/* Fewer shown players = harder. Easy shows 5, Impossible only 3. */
const CHALLENGE_PLAYER_COUNT: Record<DiffKey, number> = {
  easy: 5, medium: 4, hard: 4, extremeHard: 4, impossible: 3,
};

interface Group { entityId: string; players: Player[] }

function buildGroups(kind: "national" | "club", playerTiers: number[]): Group[] {
  const groups: Group[] = [];
  if (kind === "national") {
    for (const t of NATIONAL_TEAMS) {
      const ps = PLAYERS.filter((p) => p.countryId === t.id && playerTiers.includes(p.tier));
      if (ps.length >= 3) groups.push({ entityId: t.id, players: ps });
    }
  } else {
    for (const c of CLUBS) {
      const ps = PLAYERS.filter((p) => p.clubIds.includes(c.id) && playerTiers.includes(p.tier));
      if (ps.length >= 3) groups.push({ entityId: c.id, players: ps });
    }
  }
  return groups;
}

function pickDistractorTeams(
  kind: "national" | "club", correctId: string, preferSame: boolean, players?: Player[],
): string[] {
  // Never offer an option that is ALSO true for every shown player
  // (e.g. a club all of them played for) — that would make two "correct" answers.
  const ambiguous = new Set<string>();
  if (players && players.length > 0) {
    if (kind === "club") {
      for (const c of CLUBS) {
        if (c.id !== correctId && players.every((p) => p.clubIds.includes(c.id))) ambiguous.add(c.id);
      }
    } else {
      for (const p of players) ambiguous.add(p.countryId);
    }
  }
  const all = kind === "national" ? NATIONAL_TEAMS.map((t) => t.id) : CLUBS.map((c) => c.id);
  const others = all.filter((id) => id !== correctId && !ambiguous.has(id));
  if (kind === "national" && preferSame) {
    const correct = teamById.get(correctId)!;
    const sameConf = others.filter((id) => teamById.get(id)!.confederation === correct.confederation);
    if (sameConf.length >= 3) return pickN(sameConf, 3);
  }
  if (kind === "club" && preferSame) {
    const correct = clubById.get(correctId)!;
    const sameCountry = others.filter((id) => clubById.get(id)!.country === correct.country);
    if (sameCountry.length >= 3) return pickN(sameCountry, 3);
  }
  return pickN(others, 3);
}

function validateChallenge(
  ch: GuessChallenge,
): boolean {
  if (ch.playerIds.length < 3 || ch.playerIds.length > 5) return false;
  if (ch.distractorIds.length !== 3) return false;
  const set = new Set([ch.teamId, ...ch.distractorIds]);
  if (set.size !== 4) return false;
  for (const pid of ch.playerIds) {
    const p = playerById.get(pid);
    if (!p) return false;
    if (ch.type === "national") {
      if (p.countryId !== ch.teamId) return false; // must genuinely represent
      if (!teamById.has(ch.teamId)) return false;
    } else {
      if (!p.clubIds.includes(ch.teamId)) return false; // must genuinely have played there
      if (!clubById.has(ch.teamId)) return false;
    }
  }
  for (const d of ch.distractorIds) {
    if (ch.type === "national" ? !teamById.has(d) : !clubById.has(d)) return false;
    if (ch.type === "club") {
      // a distractor club that EVERY shown player played for would be a second correct answer
      const shown = ch.playerIds.map((id) => playerById.get(id)!);
      if (shown.every((p) => p.clubIds.includes(d))) return false;
    }
  }
  return true;
}

function generateChallenge(mode: "national" | "club", difficulty: DiffKey): GuessChallenge {
  const teamTiers = TEAM_TIER_RANGE[difficulty];
  const playerTiers = PLAYER_TIER_RANGE[difficulty];
  let groups = buildGroups(mode, playerTiers);

  // tier-aware weighting: prefer teams whose own tier matches the band
  const weightOf = (g: Group) => {
    const t = mode === "national" ? teamById.get(g.entityId)?.tier : clubById.get(g.entityId)?.tier;
    if (t === undefined) return 1;
    return teamTiers.includes(t) ? 4 : 1;
  };

  // fallback ladder so generation never fails
  let attempts = 0;
  while (attempts < 60) {
    attempts++;
    if (groups.length === 0) {
      // relax one step at a time
      const relaxed = playerTiers.flatMap((t) => [t - 1, t, t + 1]);
      groups = buildGroups(mode, [...new Set(relaxed.filter((t) => t >= 1 && t <= 5))]);
      if (groups.length === 0) break;
    }
    const group = weightedPick(groups, weightOf);
    // difficulty-specific squad size (easy 5 ... impossible 3), with light jitter
    const target = CHALLENGE_PLAYER_COUNT[difficulty];
    const jitter = Math.random() < 0.35 ? 1 : 0;
    const count = Math.min(group.players.length, Math.max(3, target - jitter));
    const players = pickN(group.players, count);
    // same-confederation / same-country distractors at EVERY level:
    // harder and matches the classic quiz feel (Japan -> Korea / Australia / Iran)
    const distractors = pickDistractorTeams(mode, group.entityId, true, players);
    // identity = team + player SET (order must not matter)
    const identity = `${difficulty}:${mode}:${group.entityId}:${players.map((p) => p.id).sort().join("+")}`;
    if (recentChallenges.includes(identity)) continue; // no immediate duplicates
    const ch: GuessChallenge = {
      id: identity,
      type: mode,
      teamId: group.entityId,
      playerIds: players.map((p) => p.id),
      difficulty,
      distractorIds: distractors,
    };
    if (!validateChallenge(ch)) continue; // discard invalid, generate another
    recentChallenges.push(identity);
    if (recentChallenges.length > 50) recentChallenges.shift();
    return ch;
  }
  // Last-resort fallback: any valid group, ignore recency
  const anyGroup = buildGroups(mode, [1, 2, 3, 4, 5]);
  const group = pick(anyGroup);
  const players = pickN(group.players, 3);
  const ch: GuessChallenge = {
    id: `${difficulty}:${mode}:${group.entityId}:${players.map((p) => p.id).sort().join("+")}`,
    type: mode,
    teamId: group.entityId,
    playerIds: players.map((p) => p.id),
    difficulty,
    distractorIds: pickDistractorTeams(mode, group.entityId, true, players),
  };
  return ch;
}

export function getRandomChallenge(mode: "national" | "club", difficulty: DiffKey): GuessChallenge {
  return generateChallenge(mode, difficulty);
}

export function resolveRandomDifficulty(): DiffKey {
  return pick(["easy", "medium", "hard", "extremeHard", "impossible"] as DiffKey[]);
}

/* ============================================================
   STATS for the menu
============================================================ */
export function dbStats() {
  let poolTotal = 0;
  for (const d of Object.keys(questionPools) as DiffKey[]) poolTotal += questionPools[d].length;
  return {
    players: PLAYERS.length,
    nationalTeams: NATIONAL_TEAMS.length,
    clubs: CLUBS.length,
    questions: poolTotal,
  };
}

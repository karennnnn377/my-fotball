export type DiffKey = "easy" | "medium" | "hard" | "extremeHard" | "impossible";
export type Mode = "quiz" | "national" | "club";
export type Era = "modern" | "classic" | "legend";

export interface NationalTeam {
  id: string;
  name: string;
  code: string;
  confederation: string;
  c1: string;
  c2: string;
  tier: number; // 1 = world-famous ... 5 = deep cut
}

export interface Club {
  id: string;
  name: string;
  code: string;
  country: string;
  c1: string;
  c2: string;
  tier: number;
}

export interface Player {
  id: string;
  name: string;
  countryId: string;
  clubIds: string[];
  tier: number; // 1 easy ... 5 obscure
  era: Era;
  position: "GK" | "DF" | "MF" | "FW";
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  answer: number; // index of correct option
  category: string;
  difficulty: DiffKey;
  explanation?: string;
}

export interface GuessChallenge {
  id: string;
  type: "national" | "club";
  teamId: string; // national team id or club id
  playerIds: string[];
  difficulty: DiffKey;
  distractorIds: string[]; // 3 wrong team/club ids
}

export interface RoundResult {
  correct: boolean;
  questionId: string;
  difficulty: DiffKey;
  points: number;
}

export interface GameResult {
  mode: Mode;
  difficulty: DiffKey | "random";
  score: number;
  correct: number;
  wrong: number;
  bestStreak: number;
  rounds: RoundResult[];
}

export const DIFF_ORDER: DiffKey[] = ["easy", "medium", "hard", "extremeHard", "impossible"];

export interface DifficultyMeta {
  key: DiffKey;
  label: string;
  tagline: string;
  points: number;
  color: string;
  deep: string;
}

export const DIFFICULTY_CONFIG: Record<DiffKey, DifficultyMeta> = {
  easy: {
    key: "easy", label: "EASY", tagline: "For casual football fans",
    points: 100, color: "var(--color-d-easy)", deep: "#0a5c30",
  },
  medium: {
    key: "medium", label: "MEDIUM", tagline: "Requires decent football knowledge",
    points: 200, color: "var(--color-d-medium)", deep: "#0c4a6e",
  },
  hard: {
    key: "hard", label: "HARD", tagline: "For serious football fans",
    points: 300, color: "var(--color-d-hard)", deep: "#7c4a03",
  },
  extremeHard: {
    key: "extremeHard", label: "EXTREME HARD", tagline: "For hardcore football fans",
    points: 500, color: "var(--color-d-extreme)", deep: "#7f1d1d",
  },
  impossible: {
    key: "impossible", label: "IMPOSSIBLE", tagline: "Expert-level football knowledge",
    points: 1000, color: "var(--color-d-impossible)", deep: "#581c69",
  },
};

export const ROUNDS_PER_GAME = 10;

/* Curated question row: [text, options(4), correctIndex, category, explanation] */
export type QuestionTuple = [string, string[], number, string, string];

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { DiffKey, Mode } from "./engine/types";

/* ============================================================
   MATCHDAY LEGENDS — TRILINGUAL INTERFACE (EN / FA / AR)
   The UI chrome is fully translated; the question database and
   player/team names stay in their original Latin spelling, as
   in every classic football video game.
   ============================================================ */

export type Lang = "en" | "fa" | "ar";

export interface Stats4 { players: number; nationalTeams: number; clubs: number; questions: number }

export interface Dict {
  locale: string;
  n: (x: number) => string;
  /* ---- menu ---- */
  season: string;
  tagline: string;
  modes: Record<Mode, { title: string; desc: string }>;
  howToPlay: string;
  dbTitle: string;
  dbPlayers: string; dbTeams: string; dbClubs: string; dbQuestions: string;
  ladder: string;
  qsShort: string; ptsShort: string;
  poolNote: (rounds: number) => string;
  ticker: (s: Stats4) => string[];
  footerLine: string;
  soundOn: string; soundOff: string;
  /* ---- difficulty ---- */
  mainMenu: string;
  selectDifficulty: string;
  dedicatedLine: string;
  questionsNote: string;
  diff: Record<DiffKey, { label: string; tag: string }>;
  randomLabel: string; randomDesc: string;
  ptsPerAnswer: string;
  poolQuiz: (n: number) => string;
  poolNational: (n: number) => string;
  poolClub: (n: number) => string;
  best: (n: number) => string;
  /* ---- how to play ---- */
  howtoTitle: string;
  howto: { title: string; body: string }[];
  backToKickoff: string;
  /* ---- game ---- */
  hudMenu: string;
  hudModes: Record<Mode, string>;
  rolling: string; rolled: string;
  difficultyWord: string;
  worth: (pts: number) => string;
  round: (a: number, b: number) => string;
  categories: Record<string, string>;
  correct: string; incorrect: string;
  plusPts: (x: number) => string;
  streakBonus: (x: number) => string;
  nextRound: string; fullTimeBtn: string;
  intlDuty: string; clubCareer: string;
  guessNatQ: string; guessClubQ: string;
  facesHidden: string;
  theAnswer: string; theCorrectAnswer: string;
  squadRevealNat: (team: string) => string;
  squadRevealClub: (team: string) => string;
  revealSentenceNat: (names: string, team: string) => string;
  revealSentenceClub: (names: string, team: string) => string;
  rouletteTitle: string;
  rouletteLine: { a: string; b: string; c: string; d: (mode: Mode) => string; e: (mode: Mode) => string };
  /* ---- full time ---- */
  fullTime: string;
  ftTitles: [string, string, string, string, string];
  pointsWord: string;
  newBest: string;
  personalBest: (x: number) => string;
  statCorrect: string; statWrong: string; statBestStreak: string; statMode: string;
  modeShort: Record<Mode, string>;
  chipNote: string;
  playAgain: string; changeDifficulty: string;
  streakTitle: (pct: number) => string;
  /* ---- about the developer ---- */
  about: {
    menuBtn: string;
    eyebrow: string;
    heading: string;
    subLine: string;
    creatorName: string;
    role: string;
    ageYears: (n: number) => string;
    fromCity: string;
    position: string;
    cardHint: string;
    stats: [string, string, string, string];
    supervisorLabel: string;
    supervisorName: string;
    supervisorRole: string;
    phoneLabel: string;
    phoneDisplay: string;
    creditsTitle: string;
    credits: { idea: string; code: string; art: string; supervision: string };
    madeWith: string;
  };
}

/* ================= ENGLISH ================= */
const EN: Dict = {
  locale: "en-US",
  n: (x) => x.toLocaleString("en-US"),
  season: "SEASON 2026 • KICK-OFF",
  tagline: "The nostalgic football video-game quiz. Three modes. Five dedicated difficulty pools. One very long final whistle.",
  modes: {
    quiz: { title: "FOOTBALL QUIZ", desc: "Multiple-choice questions across players, clubs, national teams, World Cups, Champions League, records and history." },
    national: { title: "GUESS THE NATIONAL TEAM", desc: "3–5 players who genuinely represented the same country. Pick the right national team from four game-style crests." },
    club: { title: "GUESS THE CLUB", desc: "3–5 players who genuinely played for the same club. Pick the right badge from four crests — then see the full reveal." },
  },
  howToPlay: "HOW TO PLAY",
  dbTitle: "CLUB DATABASE",
  dbPlayers: "PLAYERS", dbTeams: "NATIONAL TEAMS", dbClubs: "CLUBS", dbQuestions: "QUESTIONS",
  ladder: "DIFFICULTY LADDER",
  qsShort: "Qs", ptsShort: "pts",
  poolNote: (r) => `Every difficulty has its own dedicated question pool — the game never relabels an easy question as impossible. ${r} rounds per match.`,
  ticker: (s) => [
    `${s.players.toLocaleString("en-US")}-PLAYER DATABASE`,
    "5 DEDICATED DIFFICULTY POOLS — NEVER RELABELED",
    `${s.nationalTeams} NATIONAL TEAMS`,
    `${s.clubs} CLUBS`,
    `${s.questions.toLocaleString("en-US")}+ QUESTIONS`,
    "NO BACK-TO-BACK REPEATS",
    "RANDOM DIFFICULTY ROLLS THE POOL FIRST",
    "GUESS CHALLENGES VALIDATED BEFORE KICK-OFF",
    "EASY 100 • MEDIUM 200 • HARD 300 • EXTREME 500 • IMPOSSIBLE 1000",
  ],
  footerLine: "ORIGINAL GAME-STYLE CRESTS & PORTRAITS • NO OFFICIAL LOGOS • BUILT FOR FOOTBALL NERDS",
  soundOn: "SOUND ON", soundOff: "SOUND OFF",
  mainMenu: "MAIN MENU",
  selectDifficulty: "SELECT DIFFICULTY",
  dedicatedLine: "Each level draws from its own dedicated question pool.",
  questionsNote: "Questions are in English — the interface speaks your language.",
  diff: {
    easy: { label: "EASY", tag: "For casual football fans" },
    medium: { label: "MEDIUM", tag: "Requires decent football knowledge" },
    hard: { label: "HARD", tag: "For serious football fans" },
    extremeHard: { label: "EXTREME HARD", tag: "For hardcore football fans" },
    impossible: { label: "IMPOSSIBLE", tag: "Expert-level football knowledge" },
  },
  randomLabel: "RANDOM DIFFICULTY",
  randomDesc: "A fresh difficulty is rolled before every round — then that level's pool is used. Chaos, but fair chaos.",
  ptsPerAnswer: "PTS / ANSWER",
  poolQuiz: (x) => `${x.toLocaleString("en-US")} questions in dedicated pool`,
  poolNational: (x) => `${x.toLocaleString("en-US")} national teams in dedicated pool`,
  poolClub: (x) => `${x.toLocaleString("en-US")} clubs in dedicated pool`,
  best: (x) => `★ BEST ${x.toLocaleString("en-US")}`,
  howtoTitle: "HOW TO PLAY",
  howto: [
    {
      title: "THE THREE MODES",
      body: "**Football Quiz** — four options, one truth. Categories: Players, Clubs, National Teams, World Cup, Champions League, Records, History.\n**Guess the National Team** — 3–5 real internationals of one country. Pick the country from four original crests.\n**Guess the Club** — same idea, but the players share one club badge.",
    },
    {
      title: "THE REVEAL",
      body: "After every answer you see **CORRECT!** or **INCORRECT!**, the right crest, every player portrait with names, and an explanation. The reveal happens even when you get it wrong — that's the lesson.",
    },
    {
      title: "FIVE REAL DIFFICULTIES",
      body: "EASY is for casual fans; IMPOSSIBLE digs into 1960s Ballon d'Or winners and 1930s World Cup hat-tricks. Each level has a **separate pool** — a question never jumps levels.",
    },
    {
      title: "SCORING & STREAKS",
      body: "Easy 100 • Medium 200 • Hard 300 • Extreme Hard 500 • Impossible 1000 points per correct answer. Every straight correct stacks a **+10% streak bonus** on top of the base — up to +50% at a five-in-a-row streak. Keep the flame alive for 10 rounds.",
    },
    {
      title: "RANDOMIZATION",
      body: "Every restart shuffles questions, answer order, players, crests and challenge order. Recently used questions and challenges are set aside, so nothing repeats back-to-back while unused material remains. **Random Difficulty** rolls a level first, then uses that level's pool — never the other way around.",
    },
    {
      title: "VALIDITY GUARANTEE",
      body: "Guess challenges are generated from a verified database of 1,000+ players and validated before display: every shown player genuinely represented the nation or played for the club. No invented facts, ever.",
    },
    {
      title: "CONTROLS",
      body: "**Click / tap** an answer • **1–4** or **A–D** keys to answer • **Enter / Space** for the next round • **M** to toggle sound • the **MENU** button in the HUD quits to kick-off.",
    },
  ],
  backToKickoff: "BACK TO KICK-OFF",
  hudMenu: "MENU",
  hudModes: { quiz: "FOOTBALL QUIZ", national: "GUESS THE NATION", club: "GUESS THE CLUB" },
  rolling: "ROLLING", rolled: "ROLLED",
  difficultyWord: "DIFFICULTY",
  worth: (p) => `WORTH ${p.toLocaleString("en-US")} PTS`,
  round: (a, b) => `ROUND ${a.toLocaleString("en-US")} / ${b.toLocaleString("en-US")}`,
  categories: {
    Players: "Players", Clubs: "Clubs", "National Teams": "National Teams",
    "World Cup": "World Cup", "Champions League": "Champions League",
    Records: "Records", "Football History": "Football History",
  },
  correct: "CORRECT!", incorrect: "INCORRECT!",
  plusPts: (x) => `+${x.toLocaleString("en-US")} PTS`,
  streakBonus: (x) => `INCL. +${x.toLocaleString("en-US")} STREAK`,
  nextRound: "NEXT ROUND", fullTimeBtn: "FULL TIME",
  intlDuty: "INTERNATIONAL DUTY", clubCareer: "CLUB CAREER",
  guessNatQ: "These players all represented one national team. Which one?",
  guessClubQ: "These players all played for one club. Which one?",
  facesHidden: "FACES HIDDEN — THE NAMES ARE YOUR ONLY CLUE",
  theAnswer: "THE ANSWER", theCorrectAnswer: "THE CORRECT ANSWER",
  squadRevealNat: (t) => `SQUAD REVEAL — ALL CAPPED BY ${t.toUpperCase()}`,
  squadRevealClub: (t) => `SQUAD REVEAL — ALL PLAYED FOR ${t.toUpperCase()}`,
  revealSentenceNat: (names, team) => `${names} all represented ${team} at international level.`,
  revealSentenceClub: (names, team) => `${names} all played for ${team} during their careers.`,
  rouletteTitle: "DIFFICULTY ROULETTE",
  rouletteLine: {
    a: "A difficulty is rolled", b: "first", c: "— then only",
    d: () => "that level's dedicated pool",
    e: (m) => `supplies the ${m === "quiz" ? "question" : "challenge"}. Fair chaos.`,
  },
  fullTime: "FULL TIME",
  ftTitles: ["THE G.O.A.T.", "WORLD CLASS", "FIRST TEAM", "SQUAD PLAYER", "SUNDAY LEAGUE"],
  pointsWord: "POINTS",
  newBest: "★ NEW PERSONAL BEST ★",
  personalBest: (x) => `PERSONAL BEST ${x.toLocaleString("en-US")}`,
  statCorrect: "CORRECT", statWrong: "WRONG", statBestStreak: "BEST STREAK", statMode: "MODE",
  modeShort: { quiz: "QUIZ", national: "NATIONS", club: "CLUBS" },
  chipNote: "CHIP EDGES SHOW EACH ROUND'S ROLLED DIFFICULTY",
  playAgain: "PLAY AGAIN", changeDifficulty: "CHANGE DIFFICULTY",
  streakTitle: (p) => `Streak bonus on next correct answer: +${p}%`,
  about: {
    menuBtn: "THE DEVELOPER",
    eyebrow: "MATCHDAY LEGENDS • OFFICIAL CREDITS",
    heading: "ABOUT THE DEVELOPER",
    subLine: "Every game has a maker. This one was built from scratch by a 13-year-old football nerd in Dubai.",
    creatorName: "KAREN",
    role: "DESIGNER & PROGRAMMER",
    ageYears: (n) => `${n.toLocaleString("en-US")} YEARS OLD`,
    fromCity: "FROM DUBAI",
    position: "DEV",
    cardHint: "ONE-OF-ONE SIGNED CARD",
    stats: ["CODING", "GAME DESIGN", "FOOTBALL LOVE", "FOOTBALL IQ"],
    supervisorLabel: "SUPERVISOR",
    supervisorName: "DR. AGHAEI",
    supervisorRole: "Academic supervisor & project mentor",
    phoneLabel: "SUPERVISOR'S PHONE",
    phoneDisplay: "055 154 4988",
    creditsTitle: "GAME CREDITS",
    credits: { idea: "Idea & Design", code: "Programming", art: "Graphics & UI", supervision: "Supervision & Mentorship" },
    madeWith: "Made with love for football — Dubai",
  },
};

/* ================= فارسی ================= */
const FA: Dict = {
  locale: "fa-IR",
  n: (x) => x.toLocaleString("fa-IR"),
  season: "فصل ۲۰۲۶ • سوت آغاز",
  tagline: "کوییز فوتبالی با حس‌وحال بازی‌های ویدیویی دههٔ ۲۰۱۰. سه حالت، پنج استخر سختیِ جداگانه و یک سوت پایانِ خیلی طولانی.",
  modes: {
    quiz: { title: "کوییز فوتبال", desc: "سؤالات چهارگزینه‌ای دربارهٔ بازیکنان، باشگاه‌ها، تیم‌های ملی، جام جهانی، لیگ قهرمانان، رکوردها و تاریخ فوتبال." },
    national: { title: "حدس تیم ملی", desc: "۳ تا ۵ بازیکن که واقعاً برای یک کشور به میدان رفته‌اند. تیم درست را از بین چهار نشانِ سبکِ بازی انتخاب کنید." },
    club: { title: "حدس باشگاه", desc: "۳ تا ۵ بازیکن که واقعاً برای یک باشگاه بازی کرده‌اند. نشان درست را انتخاب کنید — بعد نمایش کامل را ببینید." },
  },
  howToPlay: "راهنمای بازی",
  dbTitle: "پایگاه دادهٔ بازی",
  dbPlayers: "بازیکنان", dbTeams: "تیم‌های ملی", dbClubs: "باشگاه‌ها", dbQuestions: "سؤال‌ها",
  ladder: "نردبان سختی",
  qsShort: "سؤال", ptsShort: "امتیاز",
  poolNote: (r) => `هر سطح سختی، استخر سؤالِ جداگانهٔ خودش را دارد — بازی هرگز برچسب سطح را عوض نمی‌کند. هر مسابقه ${r.toLocaleString("fa-IR")} راند.`,
  ticker: (s) => [
    `پایگاه دادهٔ ${s.players.toLocaleString("fa-IR")} بازیکن`,
    "۵ استخر سختیِ جداگانه — بدون جابه‌جایی برچسب",
    `${s.nationalTeams.toLocaleString("fa-IR")} تیم ملی`,
    `${s.clubs.toLocaleString("fa-IR")} باشگاه`,
    `بیش از ${s.questions.toLocaleString("fa-IR")} سؤال`,
    "بدون تکرار پشت‌سرهم",
    "سختی تصادفی اول استخر را می‌چرخاند",
    "چالش‌های حدسی پیش از سوت آغاز اعتبارسنجی می‌شوند",
    "آسان ۱۰۰ • متوسط ۲۰۰ • سخت ۳۰۰ • فوق سخت ۵۰۰ • غیرممکن ۱۰۰۰",
  ],
  footerLine: "نشان‌ها و پرتره‌های اورجینالِ سبکِ بازی • بدون لوگوی رسمی • ساخته‌شده برای عاشقان فوتبال",
  soundOn: "صدا: روشن", soundOff: "صدا: خاموش",
  mainMenu: "منوی اصلی",
  selectDifficulty: "انتخاب سختی",
  dedicatedLine: "هر سطح فقط از استخر سؤالِ مخصوصِ خودش برمی‌دارد.",
  questionsNote: "سؤال‌ها به انگلیسی هستند؛ رابط بازی به زبان شماست.",
  diff: {
    easy: { label: "آسان", tag: "برای هواداران تفننی فوتبال" },
    medium: { label: "متوسط", tag: "نیاز به دانش فوتبالی قابل‌قبول" },
    hard: { label: "سخت", tag: "برای هواداران جدی فوتبال" },
    extremeHard: { label: "فوق سخت", tag: "برای هواداران سرسخت فوتبال" },
    impossible: { label: "غیرممکن", tag: "دانش فوتبال در سطح متخصص" },
  },
  randomLabel: "سختی تصادفی",
  randomDesc: "پیش از هر راند یک سختیِ تازه چرخانده می‌شود — بعد فقط از استخر همان سطح استفاده می‌شود. هرج‌ومرج، ولی عادلانه.",
  ptsPerAnswer: "امتیاز هر پاسخ",
  poolQuiz: (x) => `${x.toLocaleString("fa-IR")} سؤال در استخر مخصوص این سطح`,
  poolNational: (x) => `${x.toLocaleString("fa-IR")} تیم ملی در استخر مخصوص این سطح`,
  poolClub: (x) => `${x.toLocaleString("fa-IR")} باشگاه در استخر مخصوص این سطح`,
  best: (x) => `★ رکورد ${x.toLocaleString("fa-IR")}`,
  howtoTitle: "راهنمای بازی",
  howto: [
    {
      title: "سه حالت بازی",
      body: "**کوییز فوتبال** — چهار گزینه، یک حقیقت. دسته‌ها: بازیکنان، باشگاه‌ها، تیم‌های ملی، جام جهانی، لیگ قهرمانان، رکوردها و تاریخ.\n**حدس تیم ملی** — ۳ تا ۵ ملی‌پوشِ واقعیِ یک کشور؛ کشور را از بین چهار نشانِ اورجینال پیدا کنید.\n**حدس باشگاه** — همان ایده، اما بازیکن‌ها در یک باشگاه مشترک بوده‌اند.",
    },
    {
      title: "نمایش بعد از پاسخ",
      body: "بعد از هر پاسخ، **درست!** یا **نادرست!** را می‌بینید؛ همراه با نشانِ صحیح، پرترهٔ همهٔ بازیکنان با اسم، و توضیح. این نمایش حتی وقتی اشتباه بزنید هم انجام می‌شود — درسِ ماجرا همان‌جاست.",
    },
    {
      title: "پنج سختیِ واقعی",
      body: "«آسان» برای هواداران تفننی است و «غیرممکن» سر از برندگان توپ طلای دههٔ ۱۹۶۰ و هتریک‌های جام جهانی دههٔ ۱۹۳۰ درمی‌آورد. هر سطح **استخر جداگانه** دارد — سؤال‌ها هرگز بین سطح‌ها جابه‌جا نمی‌شوند.",
    },
    {
      title: "امتیاز و زنجیره",
      body: "آسان ۱۰۰ • متوسط ۲۰۰ • سخت ۳۰۰ • فوق سخت ۵۰۰ • غیرممکن ۱۰۰۰ امتیاز برای هر پاسخ درست. هر پاسخِ درستِ پیاپی، **+۱۰٪ پاداش زنجیره** به امتیاز پایه اضافه می‌کند — تا حداکثر +۵۰٪ در زنجیرهٔ پنج‌تایی. شعله را برای ۱۰ راند روشن نگه دارید.",
    },
    {
      title: "تصادفی‌سازی",
      body: "هر شروعِ دوباره، سؤال‌ها، ترتیب گزینه‌ها، بازیکنان، نشان‌ها و ترتیب چالش‌ها را به‌هم می‌ریزد. سؤال‌ها و چالش‌های اخیر کنار گذاشته می‌شوند تا تا وقتی مطلبِ استفاده‌نشده هست، چیزی پشت‌سرهم تکرار نشود. **سختی تصادفی** اول یک سطح را می‌چرخاند، بعد از استخر همان سطح برمی‌دارد — نه برعکس.",
    },
    {
      title: "تضمین اعتبار",
      body: "چالش‌های حدسی از پایگاه دادهٔ تأییدشدهٔ بیش از ۱٬۰۰۰ بازیکن ساخته و پیش از نمایش اعتبارسنجی می‌شوند: هر بازیکنی که نشان داده می‌شود، واقعاً برای آن کشور یا باشگاه بازی کرده است. هیچ واقعیتِ ساختگی‌ای در کار نیست.",
    },
    {
      title: "کنترل‌ها",
      body: "برای پاسخ **کلیک/لمس** کنید • کلیدهای **1–4** یا **A–D** برای پاسخ • **Enter / Space** برای راند بعد • **M** برای قطع و وصل صدا • دکمهٔ **منو** در نوار بالای بازی، مسابقه را رها می‌کند.",
    },
  ],
  backToKickoff: "بازگشت به زمین",
  hudMenu: "منو",
  hudModes: { quiz: "کوییز فوتبال", national: "حدس تیم ملی", club: "حدس باشگاه" },
  rolling: "در حال چرخش", rolled: "انتخاب شد",
  difficultyWord: "سختی",
  worth: (p) => `ارزش: ${p.toLocaleString("fa-IR")} امتیاز`,
  round: (a, b) => `راند ${a.toLocaleString("fa-IR")} از ${b.toLocaleString("fa-IR")}`,
  categories: {
    Players: "بازیکنان", Clubs: "باشگاه‌ها", "National Teams": "تیم‌های ملی",
    "World Cup": "جام جهانی", "Champions League": "لیگ قهرمانان",
    Records: "رکوردها", "Football History": "تاریخ فوتبال",
  },
  correct: "درست!", incorrect: "نادرست!",
  plusPts: (x) => `+${x.toLocaleString("fa-IR")} امتیاز`,
  streakBonus: (x) => `شامل +${x.toLocaleString("fa-IR")} پاداش زنجیره`,
  nextRound: "راند بعد", fullTimeBtn: "سوت پایان",
  intlDuty: "بازی ملی", clubCareer: "دوران باشگاهی",
  guessNatQ: "همهٔ این بازیکنان برای یک تیم ملی بازی کرده‌اند. کدام؟",
  guessClubQ: "همهٔ این بازیکنان برای یک باشگاه بازی کرده‌اند. کدام؟",
  facesHidden: "چهره‌ها پنهان‌اند — اسم‌ها تنها سرنخِ شما هستند",
  theAnswer: "پاسخ", theCorrectAnswer: "پاسخ صحیح",
  squadRevealNat: (t) => `نمایش ترکیب — همه برای «${t}» بازی ملی داشته‌اند`,
  squadRevealClub: (t) => `نمایش ترکیب — همه برای «${t}» بازی کرده‌اند`,
  revealSentenceNat: (names, team) => `${names} — همه در ردهٔ ملی برای «${team}» بازی کرده‌اند.`,
  revealSentenceClub: (names, team) => `${names} — همه در دوران حرفه‌ای‌شان برای «${team}» بازی کرده‌اند.`,
  rouletteTitle: "رولت سختی",
  rouletteLine: {
    a: "سختی", b: "اول", c: "چرخانده می‌شود — بعد فقط",
    d: () => "استخرِ مخصوصِ همان سطح",
    e: (m) => `${m === "quiz" ? "سؤال" : "چالش"} را تأمین می‌کند. هرج‌ومرجِ عادلانه.`,
  },
  fullTime: "سوت پایان",
  ftTitles: ["بهترینِ همهٔ دوران", "کلاس جهانی", "تیم اصلی", "بازیکن ذخیره", "لیگ محلی"],
  pointsWord: "امتیاز",
  newBest: "★ رکورد شخصیِ جدید ★",
  personalBest: (x) => `رکورد شخصی ${x.toLocaleString("fa-IR")}`,
  statCorrect: "درست", statWrong: "نادرست", statBestStreak: "بهترین زنجیره", statMode: "حالت",
  modeShort: { quiz: "کوییز", national: "ملی", club: "باشگاهی" },
  chipNote: "لبهٔ رنگیِ هر کارت، سختیِ همان راند را نشان می‌دهد",
  playAgain: "بازی دوباره", changeDifficulty: "تغییر سختی",
  streakTitle: (p) => `پاداش زنجیره برای پاسخ درستِ بعدی: +${p.toLocaleString("fa-IR")}٪`,
  about: {
    menuBtn: "دربارهٔ سازنده",
    eyebrow: "MATCHDAY LEGENDS • عوامل رسمی بازی",
    heading: "دربارهٔ سازنده",
    subLine: "هر بازی‌ای یک سازنده دارد؛ این بازی را یک فوتبال‌باز ۱۳ ساله در دبی از صفر ساخته است.",
    creatorName: "کارِن",
    role: "طراح و برنامه‌نویس",
    ageYears: (n) => `${n.toLocaleString("fa-IR")} ساله`,
    fromCity: "از دبی",
    position: "DEV",
    cardHint: "کارت امضاشده — تک‌نسخه",
    stats: ["کدنویسی", "طراحی بازی", "عشق به فوتبال", "دانش فوتبال"],
    supervisorLabel: "استاد راهنما",
    supervisorName: "دکتر آقایی",
    supervisorRole: "نظارت علمی و راهنمایی پروژه",
    phoneLabel: "شمارهٔ تماس استاد",
    phoneDisplay: "055 154 4988",
    creditsTitle: "عوامل بازی",
    credits: { idea: "ایده و طراحی", code: "برنامه‌نویسی", art: "گرافیک و رابط کاربری", supervision: "نظارت و راهنمایی" },
    madeWith: "ساخته‌شده با عشق به فوتبال — دبی",
  },
};

/* ================= العربية ================= */
const AR: Dict = {
  locale: "ar-EG",
  n: (x) => x.toLocaleString("ar-EG"),
  season: "موسم ٢٠٢٦ • صافرة البداية",
  tagline: "كويز كرة القدم بروح ألعاب الفيديو الكلاسيكية من عقد ٢٠١٠. ثلاثة أوضاع، خمس قواعد صعوبة منفصلة، وصافرة نهاية طويلة جداً.",
  modes: {
    quiz: { title: "كويز كرة القدم", desc: "أسئلة اختيار من متعدد حول اللاعبين والأندية والمنتخبات وكأس العالم ودوري الأبطال والأرقام القياسية والتاريخ." },
    national: { title: "خمّن المنتخب", desc: "٣ إلى ٥ لاعبين مثّلوا بلداً واحداً فعلاً. اختر المنتخب الصحيح من أربعة شعارات بأسلوب اللعبة." },
    club: { title: "خمّن النادي", desc: "٣ إلى ٥ لاعبين لعبوا للنادي نفسه فعلاً. اختر الشعار الصحيح — ثم شاهد الكشف الكامل." },
  },
  howToPlay: "طريقة اللعب",
  dbTitle: "قاعدة بيانات اللعبة",
  dbPlayers: "اللاعبون", dbTeams: "المنتخبات", dbClubs: "الأندية", dbQuestions: "الأسئلة",
  ladder: "سلّم الصعوبة",
  qsShort: "سؤال", ptsShort: "نقطة",
  poolNote: (r) => `لكل مستوى صعوبة قاعدةُ أسئلةٍ خاصة به — اللعبة لا تبدّل التصنيف أبداً. كل مباراة ${r.toLocaleString("ar-EG")} جولات.`,
  ticker: (s) => [
    `قاعدة بيانات من ${s.players.toLocaleString("ar-EG")} لاعب`,
    "٥ قواعد صعوبة منفصلة — لا إعادة تصنيف أبداً",
    `${s.nationalTeams.toLocaleString("ar-EG")} منتخباً وطنياً`,
    `${s.clubs.toLocaleString("ar-EG")} نادياً`,
    `أكثر من ${s.questions.toLocaleString("ar-EG")} سؤال`,
    "لا تكرار متتالٍ أبداً",
    "الصعوبة العشوائية تُدير القاعدة أولاً",
    "تحديات التخمين تُتحقَّق قبل صافرة البداية",
    "سهل ١٠٠ • متوسط ٢٠٠ • صعب ٣٠٠ • صعب للغاية ٥٠٠ • مستحيل ١٠٠٠",
  ],
  footerLine: "شعارات وصور لاعبين أصلية بأسلوب اللعبة • بدون شعارات رسمية • صُنعت لعشاق كرة القدم",
  soundOn: "الصوت: مفعّل", soundOff: "الصوت: مكتوم",
  mainMenu: "القائمة الرئيسية",
  selectDifficulty: "اختر الصعوبة",
  dedicatedLine: "كل مستوى يسحب من قاعدة أسئلته الخاصة فقط.",
  questionsNote: "الأسئلة باللغة الإنجليزية — أما الواجهة فبلغتك.",
  diff: {
    easy: { label: "سهل", tag: "لعشاق كرة القدم العاديين" },
    medium: { label: "متوسط", tag: "يتطلب معرفة كروية جيدة" },
    hard: { label: "صعب", tag: "لعشاق كرة القدم الجادّين" },
    extremeHard: { label: "صعب للغاية", tag: "للمتعصبين لكرة القدم" },
    impossible: { label: "مستحيل", tag: "معرفة كروية بمستوى الخبراء" },
  },
  randomLabel: "صعوبة عشوائية",
  randomDesc: "تُدار صعوبةٌ جديدة قبل كل جولة — ثم تُستخدم قاعدة ذلك المستوى فقط. فوضى، لكنها فوضى عادلة.",
  ptsPerAnswer: "نقطة لكل إجابة",
  poolQuiz: (x) => `${x.toLocaleString("ar-EG")} سؤالاً في القاعدة المخصصة`,
  poolNational: (x) => `${x.toLocaleString("ar-EG")} منتخباً في القاعدة المخصصة`,
  poolClub: (x) => `${x.toLocaleString("ar-EG")} نادياً في القاعدة المخصصة`,
  best: (x) => `★ الأفضل ${x.toLocaleString("ar-EG")}`,
  howtoTitle: "طريقة اللعب",
  howto: [
    {
      title: "أوضاع اللعب الثلاثة",
      body: "**كويز كرة القدم** — أربعة خيارات وحقيقة واحدة. الفئات: اللاعبون، الأندية، المنتخبات، كأس العالم، دوري الأبطال، الأرقام القياسية، التاريخ.\n**خمّن المنتخب** — ٣ إلى ٥ لاعبين دوليين حقيقيين لبلد واحد. اختر البلد من أربعة شعارات أصلية.\n**خمّن النادي** — الفكرة نفسها، لكن اللاعبين اشتركوا في شعار نادٍ واحد.",
    },
    {
      title: "الكشف بعد الإجابة",
      body: "بعد كل إجابة ترى **صحيح!** أو **خطأ!** مع الشعار الصحيح وصور جميع اللاعبين بأسمائهم وشرح للإجابة. يحدث الكشف حتى عندما تخطئ — فهناك الدرس.",
    },
    {
      title: "خمس صعوبات حقيقية",
      body: "«سهل» للعشاق العاديين، و«مستحيل» ينبش في الفائزين بالكرة الذهبية في الستينات وهاتريك كأس العالم في الثلاثينات. لكل مستوى **قاعدة منفصلة** — لا تقفز الأسئلة بين المستويات أبداً.",
    },
    {
      title: "النقاط والسلاسل",
      body: "سهل ١٠٠ • متوسط ٢٠٠ • صعب ٣٠٠ • صعب للغاية ٥٠٠ • مستحيل ١٠٠٠ نقطة لكل إجابة صحيحة. كل إجابة صحيحة متتالية تضيف **مكافأة سلسلة +١٠٪** فوق الأساس — حتى +٥٠٪ عند سلسلة من خمس. أبقِ الشعلة مشتعلة طوال الجولات العشر.",
    },
    {
      title: "العشوائية",
      body: "كل إعادة تشغيل تخلط الأسئلة وترتيب الخيارات واللاعبين والشعارات وترتيب التحديات. تُستبعد الأسئلة والتحديات المستخدمة مؤخراً فلا يتكرر شيء متتالياً ما دام هناك ما لم يُستخدم. **الصعوبة العشوائية** تُدير المستوى أولاً ثم تستخدم قاعدة ذلك المستوى — وليس العكس.",
    },
    {
      title: "ضمان الصلاحية",
      body: "تُولَّد تحديات التخمين من قاعدة بيانات موثّقة تضم أكثر من ١٠٠٠ لاعب وتُتحقَّق قبل العرض: كل لاعب معروض مثّل المنتخب أو لعب للنادي فعلاً. لا حقائق مختلَقة، أبداً.",
    },
    {
      title: "أزرار التحكم",
      body: "**انقر/المس** للإجابة • المفاتيح **1–4** أو **A–D** للإجابة • **Enter / Space** للجولة التالية • **M** لكتم الصوت • زر **القائمة** في الشريط العلوي ينهي المباراة.",
    },
  ],
  backToKickoff: "العودة إلى البداية",
  hudMenu: "القائمة",
  hudModes: { quiz: "كويز كرة القدم", national: "خمّن المنتخب", club: "خمّن النادي" },
  rolling: "جارٍ الاختيار", rolled: "تم الاختيار",
  difficultyWord: "الصعوبة",
  worth: (p) => `تستحق ${p.toLocaleString("ar-EG")} نقطة`,
  round: (a, b) => `الجولة ${a.toLocaleString("ar-EG")} من ${b.toLocaleString("ar-EG")}`,
  categories: {
    Players: "اللاعبون", Clubs: "الأندية", "National Teams": "المنتخبات",
    "World Cup": "كأس العالم", "Champions League": "دوري الأبطال",
    Records: "الأرقام القياسية", "Football History": "تاريخ كرة القدم",
  },
  correct: "صحيح!", incorrect: "خطأ!",
  plusPts: (x) => `+${x.toLocaleString("ar-EG")} نقطة`,
  streakBonus: (x) => `تشمل +${x.toLocaleString("ar-EG")} مكافأة سلسلة`,
  nextRound: "الجولة التالية", fullTimeBtn: "صافرة النهاية",
  intlDuty: "المشوار الدولي", clubCareer: "المشوار مع الأندية",
  guessNatQ: "كل هؤلاء اللاعبين مثّلوا منتخباً واحداً. أيّ منتخب؟",
  guessClubQ: "كل هؤلاء اللاعبين لعبوا لنادٍ واحد. أيّ نادٍ؟",
  facesHidden: "الوجوه مخفية — الأسماء هي دليلك الوحيد",
  theAnswer: "الإجابة", theCorrectAnswer: "الإجابة الصحيحة",
  squadRevealNat: (t) => `الكشف — جميعهم مثّلوا «${t}»`,
  squadRevealClub: (t) => `الكشف — جميعهم لعبوا لنادي «${t}»`,
  revealSentenceNat: (names, team) => `${names} — جميعهم مثّلوا «${team}» على المستوى الدولي.`,
  revealSentenceClub: (names, team) => `${names} — جميعهم لعبوا لنادي «${team}» خلال مسيرتهم.`,
  rouletteTitle: "عجلة الصعوبة",
  rouletteLine: {
    a: "تُدار الصعوبة", b: "أولاً", c: "— ثم",
    d: () => "قاعدة ذلك المستوى المخصصة",
    e: (m) => `فقط تمدّك بـ${m === "quiz" ? "السؤال" : "التحدي"}. فوضى عادلة.`,
  },
  fullTime: "صافرة النهاية",
  ftTitles: ["الأعظم في التاريخ", "مستوى عالمي", "التشكيلة الأساسية", "لاعب احتياط", "دوري الحواري"],
  pointsWord: "نقطة",
  newBest: "★ رقم شخصي جديد ★",
  personalBest: (x) => `الرقم الشخصي ${x.toLocaleString("ar-EG")}`,
  statCorrect: "صحيحة", statWrong: "خاطئة", statBestStreak: "أفضل سلسلة", statMode: "الوضع",
  modeShort: { quiz: "كويز", national: "منتخبات", club: "أندية" },
  chipNote: "حواف البطاقات تُظهر صعوبة كل جولة",
  playAgain: "العب مجدداً", changeDifficulty: "تغيير الصعوبة",
  streakTitle: (p) => `مكافأة السلسلة للإجابة الصحيحة التالية: +${p.toLocaleString("ar-EG")}٪`,
  about: {
    menuBtn: "عن المطوّر",
    eyebrow: "MATCHDAY LEGENDS • صُنّاع اللعبة",
    heading: "عن المطوّر",
    subLine: "لكل لعبة صانع؛ هذه اللعبة صنعها عاشق كرة قدم عمره ١٣ سنة من دبي، من الصفر.",
    creatorName: "كارِن",
    role: "المصمّم والمبرمج",
    ageYears: (n) => `العمر ${n.toLocaleString("ar-EG")} سنة`,
    fromCity: "من دبي",
    position: "DEV",
    cardHint: "بطاقة موقّعة — نسخة وحيدة",
    stats: ["البرمجة", "تصميم اللعبة", "حب كرة القدم", "ذكاء كرة القدم"],
    supervisorLabel: "المشرف",
    supervisorName: "د. آقايي",
    supervisorRole: "الإشراف العلمي وتوجيه المشروع",
    phoneLabel: "رقم تواصل المشرف",
    phoneDisplay: "055 154 4988",
    creditsTitle: "صُنّاع اللعبة",
    credits: { idea: "الفكرة والتصميم", code: "البرمجة", art: "الجرافيك والواجهة", supervision: "الإشراف والتوجيه" },
    madeWith: "صُنعت بحب كرة القدم — دبي",
  },
};

const DICTS: Record<Lang, Dict> = { en: EN, fa: FA, ar: AR };

/* ================= provider ================= */
const LANG_KEY = "mdl-lang";
function readLang(): Lang {
  try {
    const s = localStorage.getItem(LANG_KEY);
    if (s === "fa" || s === "ar" || s === "en") return s;
  } catch { /* private mode */ }
  return "en";
}
function applyToDocument(l: Lang) {
  document.documentElement.lang = l;
  document.documentElement.dir = l === "en" ? "ltr" : "rtl";
}
applyToDocument(readLang()); // at module load — no flash of wrong direction

interface Ctx { lang: Lang; setLang: (l: Lang) => void; t: Dict; dir: "ltr" | "rtl" }
const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(LANG_KEY, l); } catch { /* ignore */ }
  };
  useEffect(() => { applyToDocument(lang); }, [lang]);
  const t = DICTS[lang];
  const dir: "ltr" | "rtl" = lang === "en" ? "ltr" : "rtl";
  return <LangContext.Provider value={{ lang, setLang, t, dir }}>{children}</LangContext.Provider>;
}

export function useI18n(): Ctx {
  const c = useContext(LangContext);
  if (!c) throw new Error("useI18n must be used inside LangProvider");
  return c;
}

/* ================= segmented language switcher ================= */
const LANGS: { id: Lang; short: string; name: string }[] = [
  { id: "en", short: "EN", name: "English" },
  { id: "fa", short: "فا", name: "فارسی" },
  { id: "ar", short: "ع", name: "العربية" },
];
export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <div dir="ltr" className={`plate flex items-center gap-1 rounded-lg p-1 ${className}`} role="group" aria-label="Language">
      {LANGS.map((l) => {
        const active = lang === l.id;
        return (
          <button
            key={l.id}
            onClick={() => { if (!active) setLang(l.id); }}
            title={l.name}
            aria-pressed={active}
            className={`lang-btn display rounded-md px-2.5 py-1 text-[12px] leading-none transition-all duration-150 ${active ? "text-[#071531]" : "text-ink-dim hover:text-white hover:-translate-y-px"}`}
            style={active
              ? { background: "linear-gradient(180deg, #ffe08a, #f7b32b)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55), 0 2px 8px rgba(2,6,20,0.55), 0 0 12px rgba(247,179,43,0.35)" }
              : undefined}
          >
            {l.short}
          </button>
        );
      })}
    </div>
  );
}

/* ================= tiny **bold** renderer ================= */
export function Rich({ s }: { s: string }) {
  return (
    <>
      {s.split("\n").map((para, pi) => (
        <p key={pi} className={pi ? "mt-2" : ""}>
          {para.split("**").map((chunk, i) => (i % 2 ? <strong key={i} className="text-white">{chunk}</strong> : <span key={i}>{chunk}</span>))}
        </p>
      ))}
    </>
  );
}

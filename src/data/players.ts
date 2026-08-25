import { Era, Player } from "../engine/types";
import { RAW_PLAYERS_1 } from "./players1";
import { RAW_PLAYERS_2 } from "./players2";
import { RAW_PLAYERS_3 } from "./players3";
import { RAW_PLAYERS_4 } from "./players4";
import { NATIONAL_TEAMS } from "./teams";
import { CLUBS } from "./clubs";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const usedIds = new Set<string>();

function parse(raw: string): Player[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && line.includes("|"))
    .map((line) => {
      const [name, countryId, clubs, tier, era, position] = line.split("|").map((s) => (s || "").trim());
      let id = slugify(name);
      while (usedIds.has(id)) id = id + "-x";
      usedIds.add(id);
      return {
        id,
        name,
        countryId,
        clubIds: clubs ? clubs.split(",").map((c) => c.trim()).filter(Boolean) : [],
        tier: Number(tier) || 3,
        era: (era as Era) || "modern",
        position: (position as Player["position"]) || "MF",
      };
    });
}

/* ============================================================
   REFERENTIAL-INTEGRITY GUARD
   A player row is only usable if its country exists in the
   national-team database; club ids that do not exist in the
   club database are silently dropped. This guarantees that
   every generated question and every guess challenge is built
   on verified links only (master spec #15 / #44 / #48), and
   keeps the lobby statistics honest.
   ============================================================ */
const VALID_COUNTRY = new Set(NATIONAL_TEAMS.map((t) => t.id));
const VALID_CLUB = new Set(CLUBS.map((c) => c.id));

/* ============================================================
   EASY-POOL ICON PROMOTIONS (spec #5 / #22)
   A curated list of globally recognised superstars. A listed
   player is moved to tier 1 ONLY if currently tier 2 — the
   dedicated EASY guess pools get more household names, while
   every other difficulty keeps exactly its own players. No
   question or challenge is ever relabeled (spec #10 / #46).
   ============================================================ */
const ICON_TIER_1 = new Set([
  "rivaldo", "romario", "cafu", "roberto-carlos",
  "gabriel-batistuta", "carlos-tevez", "hernan-crespo", "javier-zanetti",
  "diego-forlan", "diego-godin",
  "luis-figo", "rui-costa", "deco", "pepe",
  "marco-van-basten", "dennis-bergkamp", "robin-van-persie", "arjen-robben",
  "wesley-sneijder", "clarence-seedorf",
  "romelu-lukaku", "thibaut-courtois",
  "frank-lampard", "paul-scholes", "john-terry",
  "carles-puyol", "david-villa", "fernando-torres", "xabi-alonso",
  "cesc-fabregas", "sergio-busquets", "gerard-pique",
  "antoine-griezmann", "patrick-vieira", "paul-pogba", "n-golo-kante",
  "olivier-giroud", "raphael-varane", "franck-ribery", "robert-pires",
  "gerd-muller", "michael-ballack", "oliver-kahn", "miroslav-klose",
  "bastian-schweinsteiger", "philipp-lahm", "mesut-ozil",
  "davor-suker", "dusan-vlahovic", "achraf-hakimi", "park-ji-sung",
  "christian-pulisic", "samuel-etoo", "didier-drogba", "yaya-toure",
  "george-weah", "petr-cech", "gheorghe-hagi", "andriy-shevchenko",
  "peter-schmeichel", "christian-eriksen", "ryan-giggs",
]);

export const PLAYERS: Player[] = [
  ...parse(RAW_PLAYERS_1),
  ...parse(RAW_PLAYERS_2),
  ...parse(RAW_PLAYERS_3),
  ...parse(RAW_PLAYERS_4),
]
  .filter((p) => p.name.length > 1 && VALID_COUNTRY.has(p.countryId))
  .map((p) => ({
    ...p,
    tier: p.tier === 2 && ICON_TIER_1.has(p.id) ? 1 : p.tier,
    clubIds: p.clubIds.filter((c) => VALID_CLUB.has(c)),
  }));

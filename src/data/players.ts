import { Era, Player } from "../engine/types";
import { RAW_PLAYERS_1 } from "./players1";
import { RAW_PLAYERS_2 } from "./players2";
import { RAW_PLAYERS_3 } from "./players3";
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

export const PLAYERS: Player[] = [
  ...parse(RAW_PLAYERS_1),
  ...parse(RAW_PLAYERS_2),
  ...parse(RAW_PLAYERS_3),
]
  .filter((p) => p.name.length > 1 && VALID_COUNTRY.has(p.countryId))
  .map((p) => ({ ...p, clubIds: p.clubIds.filter((c) => VALID_CLUB.has(c)) }));

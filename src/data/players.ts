import { Era, Player } from "../engine/types";
import { RAW_PLAYERS_1 } from "./players1";
import { RAW_PLAYERS_2 } from "./players2";
import { RAW_PLAYERS_3 } from "./players3";

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
  return raw.split("\n").map((line) => {
    const [name, countryId, clubs, tier, era, position] = line.split("|");
    let id = slugify(name);
    while (usedIds.has(id)) id = id + "-x";
    usedIds.add(id);
    return {
      id,
      name,
      countryId,
      clubIds: clubs ? clubs.split(",").filter(Boolean) : [],
      tier: Number(tier),
      era: era as Era,
      position: (position as Player["position"]) || "MF",
    };
  });
}

export const PLAYERS: Player[] = [
  ...parse(RAW_PLAYERS_1),
  ...parse(RAW_PLAYERS_2),
  ...parse(RAW_PLAYERS_3),
];

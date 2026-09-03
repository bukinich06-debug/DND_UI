import type { IPurse } from "@/components/shared/types";

const UNITS = ["pp", "gp", "ep", "sp", "cp"] as const;

export type PurseUnit = (typeof UNITS)[number];

export const diffUnits = (prev: IPurse, next: IPurse): PurseUnit[] =>
  UNITS.filter((unit) => prev[unit] !== next[unit]);

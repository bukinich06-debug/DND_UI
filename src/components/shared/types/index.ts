export interface ILocationReply {
  agent: "location";
  locationId: string;
  name: string;
  isSecret: boolean;
  description: string;
  summary: string;
  features: string;
}

export interface INpcReply {
  agent: "npc";
  npcId: string;
  npcName: string;
  say: string;
  do: string | null;
}

export interface IMasterReply {
  agent: "master";
}

export type ITurnReply = ILocationReply | INpcReply | IMasterReply;

export interface IPlayerEntry {
  id: string;
  agent: "player";
  do: string | null;
  say: string | null;
}

export interface ICheckEntry {
  id: string;
  agent: "check";
  skill: string;
  roll: string;
  result: "success" | "failure";
}

export type ILogEntry = (ITurnReply & { id: string }) | IPlayerEntry | ICheckEntry;

export type ItemCategory = "weapons" | "armor" | "consumables" | "quest" | "other";
export type CategoryFilter = "all" | ItemCategory;

export type ItemRarity = "common" | "uncommon" | "rare" | "veryRare" | "legendary" | "artifact";

export type ItemKind =
  | "weapon"
  | "armor"
  | "shield"
  | "tool"
  | "gear"
  | "consumable"
  | "treasure"
  | "key"
  | "junk"
  | "other";

export interface IInventoryItem {
  id: string;
  name: string;
  kind: ItemKind;
  category: ItemCategory;
  qty: number;
  description: string;
  weight: number;
  rarity?: ItemRarity;
  equipped?: boolean;
  isTwoHanded?: boolean;
  value?: string;
  properties?: string[];
}

export interface IPurse {
  pp: number;
  gp: number;
  ep: number;
  sp: number;
  cp: number;
}

export type TabId = "character" | "spells" | "journal";
export type ActionId = "talk" | "inspect" | "search" | "attack" | "move" | "rest" | "stealth";

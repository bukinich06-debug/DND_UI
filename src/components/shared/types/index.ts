export type LogType = "narration" | "npc" | "player" | "system" | "combat";

export interface ILogMessage {
  id: number;
  type: LogType;
  text: string;
  speaker?: string;
  roll?: string;
  timestamp?: string;
}

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

export interface IContent {
  log: ILogMessage[];
}

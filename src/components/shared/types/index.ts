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

export interface IInventoryItem {
  id: number;
  name: string;
  category: ItemCategory;
  qty: number;
  description: string;
  weight: number;
  rarity?: "common" | "uncommon" | "rare";
  equipped?: boolean;
  value?: string;
  properties?: string[];
}

export interface INearbyEntry {
  icon: string;
  label: string;
  sub: string;
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
  items: IInventoryItem[];
  nearby: INearbyEntry[];
}

import type { TabId } from "@/components/shared/types";

export interface ICharacterPanelProps {
  onInventory: () => void;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export interface IPlayer {
  id: string;
  campaignId: string;
  name: string;
  species: string;
  className: string;
  subclass: string | null;
  background: string;
  level: number;
  xp: number | null;
  alignment: string | null;
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  hpMax: number;
  hpCurrent: number;
  hpTemp: number;
  hitDie: string;
  hitDiceLeft: number;
  ac: number;
  speed: number;
  initiativeBonus: number | null;
  proficiencyBonus: number;
  inspiration: boolean;
  deathSaveSuccess: number;
  deathSaveFail: number;
  armorProf: string[];
  weaponProf: string[];
  toolProf: string[];
  languages: string[];
  skillProf: string[];
  skillExpertise: string[];
  saveProf: string[];
  features: unknown;
  spells: unknown;
  notes: string | null;
  portraitUrl: string | null;
  coinsCp: number;
  conditions: string[];
  exhaustionLevel: number;
  locationId: string | null;
  travelDestinationId: string | null;
  travelRoute: string[] | null;
  travelLegIndex: number | null;
  travelDaysLeft: number | null;
}

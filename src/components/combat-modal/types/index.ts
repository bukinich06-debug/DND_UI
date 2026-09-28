export type CombatantType = "player" | "npc" | "monster"

export interface ICombatant {
  id: string
  name: string
  type: CombatantType
  hp: number
  maxHp: number
  feetFromPlayer: number
  positionFeet: number
  initiative: number
  order: number
  isOut: boolean
  isPlayerTurn?: boolean
  actionUsed: boolean
  bonusActionUsed: boolean
  reactionUsed: boolean
  movementUsedFeet: number
  speed: number
  playerId: string | null
  deathSaveSuccess?: number
  deathSaveFail?: number
  isStable?: boolean
  dead?: boolean
  conditions?: string[]
}

export interface IWeaponProperty {
  type: "range" | "twoHanded" | "damage" | string
  text: string
  normal?: number
  long?: number
  dice?: string
  damageType?: string
}

export interface IWeaponSlot {
  id: string
  name: string
  properties: IWeaponProperty[]
}

export interface IEncounter {
  id: string
  active: boolean
  round: number
  isPlayerTurn: boolean
  combatants: ICombatant[]
  log: ICombatLogEntry[]
}

export interface ICombatOutcome {
  victory: boolean
  outcome?: "victory" | "captured" | "defeat" | "fled"
  defeated: string[]
  survivors: string[]
  defeatedMonsters: Array<{ name: string; catalogKey: string }>
  capturedBy?: string[]
}

export interface ICombatLogEntryMeta {
  attackRoll?: number
  attackBonus?: number
  attackTotal?: number
  targetAc?: number
  damageTotal?: number
  hpBefore?: number
  hpAfter?: number
  kind?: string
}

export interface ICombatLogEntry {
  id: string
  timestamp: number
  message: string
  actorName?: string
  meta?: ICombatLogEntryMeta
}

export interface IApiParticipant {
  id: string
  kind: "player" | "npc" | "monster"
  displayName: string
  hpCurrent: number
  hpMax: number
  initiative: number
  order: number
  feetFromPlayer: number
  positionFeet: number
  isOut: boolean
  playerId: string | null
  npcId: string | null
  monsterInstanceId: string | null
  actionUsed?: boolean
  bonusActionUsed?: boolean
  reactionUsed?: boolean
  movementUsedFeet?: number
  speed?: number
  deathSaveSuccess?: number
  deathSaveFail?: number
  isStable?: boolean
  dead?: boolean
  conditions?: string[]
}

export interface IApiEncounter {
  encounterId: string
  round: number
  currentTurnIndex: number
  status: string
  currentParticipantId: string
  isPlayerTurn: boolean
  participants: IApiParticipant[]
  log?: ICombatLogEntry[]
}

export interface IApiEncounterResponse {
  hasActiveEncounter: boolean
  encounter: IApiEncounter | null
}

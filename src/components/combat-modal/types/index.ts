export type CombatantType = "player" | "npc" | "monster" | "ally"

export interface ICombatant {
  id: string
  name: string
  type: CombatantType
  hp: number
  maxHp: number
  feetFromPlayer: number
  order: number
  isPlayerTurn?: boolean
}

export interface IWeaponProperty {
  type: "range" | "twoHanded" | string
  normal?: number
  long?: number
  text?: string
}

export interface IWeaponSlot {
  id: string
  name: string
  properties: IWeaponProperty[]
}

export interface IEncounter {
  id: string
  active: boolean
  combatants: ICombatant[]
  currentTurnPlayerId: string | null
  log: ICombatLogEntry[]
}

export interface ICombatLogEntry {
  id: string
  timestamp: number
  message: string
  actorName?: string
}

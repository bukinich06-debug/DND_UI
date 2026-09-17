export type CombatantType = "player" | "npc" | "monster"

export interface ICombatant {
  id: string
  name: string
  type: CombatantType
  hp: number
  maxHp: number
  feetFromPlayer: number
  initiative: number
  isOut: boolean
  isPlayerTurn?: boolean
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

export interface ICombatLogEntry {
  id: string
  timestamp: number
  message: string
  actorName?: string
}

export interface IApiParticipant {
  id: string
  kind: "player" | "npc" | "monster"
  displayName: string
  hpCurrent: number
  hpMax: number
  initiative: number
  feetFromPlayer: number
  isOut: boolean
  playerId: string | null
  npcId: string | null
  monsterInstanceId: string | null
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

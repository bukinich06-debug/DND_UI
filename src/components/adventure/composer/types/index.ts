import type { ActionId } from "@/components/shared/types"

export type StructuredActionId = Exclude<ActionId, "free">

export type InspectKind = "location" | "npc" | "item" | "other"
export type SearchScope = "location" | "npc"
export type RestKind = "short" | "long" | "pause"

export const UNARMED_ID = "unarmed"
export const ENV_NPC_ID = ""

export interface IActionFormState {
  npcId: string
  say: string
  do: string
  inspectKind: InspectKind
  itemId: string
  otherTarget: string
  focus: string
  searchScope: SearchScope
  query: string
  weaponId: string
  manner: string
  exitId: string
  localPath: string
  restKind: RestKind
  circumstances: string
  stealthNpcId: string
  stealthAction: string
}

export const emptyForm = (): IActionFormState => ({
  npcId: "",
  say: "",
  do: "",
  inspectKind: "location",
  itemId: "",
  otherTarget: "",
  focus: "",
  searchScope: "location",
  query: "",
  weaponId: UNARMED_ID,
  manner: "",
  exitId: "",
  localPath: "",
  restKind: "short",
  circumstances: "",
  stealthNpcId: ENV_NPC_ID,
  stealthAction: "",
})

export interface IComposerNpc {
  id: string
  name: string
}

export interface IComposerItem {
  id: string
  name: string
  kind: string
}

export interface IComposerExit {
  id: string
  name: string
  kind: "parent" | "child"
}

export interface IBuildTurnTextParams {
  action: StructuredActionId
  form: IActionFormState
  npcs: IComposerNpc[]
  items: IComposerItem[]
  exits: IComposerExit[]
}

export type LocationKind = "region" | "settlement" | "district" | "building" | "room" | "dungeon" | "wilderness" | "other"

export interface ILocation {
  id: string
  campaignId: string
  parentId: string | null
  kind: LocationKind
  name: string
  summary: string
  description: string
  features: string
  isSecret: boolean
  tags: string[]
}

export interface ILocationLink {
  id: string
  campaignId: string
  fromId: string
  toId: string
  days: number
  label: string | null
}

export interface IPlayerTravel {
  destinationId: string
  destination: ILocation
  route: string[]
  legIndex: number
  daysLeft: number
}

export interface IPlayerLocation {
  playerId: string
  location: ILocation | null
  travel: IPlayerTravel | null
}

export interface IPoint {
  x: number
  y: number
}

export interface ILayoutNode {
  loc: ILocation
  x: number
  y: number
}

export interface ITreeEdge {
  fromId: string
  toId: string
  d: string
}

export interface IRoadEdge {
  id: string
  fromId: string
  toId: string
  d: string
  labelX: number
  labelY: number
  days: number
  label: string | null
  onRoute: boolean
  currentLeg: boolean
}

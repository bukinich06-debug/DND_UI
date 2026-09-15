interface IItemProp {
  type: string
  text: string
}

export interface IApiShopItem {
  id: string
  catalogKey: string
  name: string
  kind: string
  description: string
  quantity: number
  priceCp: number
  rarity: string | null
  isMagical: boolean
  properties: IItemProp[] | null
  weight: number | null
}

export interface IApiShopData {
  npcId: string
  npcName: string
  specialtyKey: string
  specialtyName: string
  playerCoinsCp: number
  items: IApiShopItem[]
}

export interface IShopItem {
  id: string
  catalogKey: string
  name: string
  kind: string
  description: string
  quantity: number
  priceCp: number
  priceFormatted: string
  rarity: string | null
  isMagical: boolean
  properties: string[] | null
  weight: number | null
}

export interface IShopData {
  npcId: string
  npcName: string
  specialtyKey: string
  specialtyName: string
  playerCoinsCp: number
  items: IShopItem[]
}

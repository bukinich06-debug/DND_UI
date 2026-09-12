import type { IPurse } from "@/components/shared/types"

interface IGetCoinsParams {
  signal?: AbortSignal
}

interface ICoinBalance {
  owner: {
    kind: string
    id: string
  }
  coinsCp: number
  coins: IPurse
}

export interface ICoinsResult {
  coins: IPurse
  coinsCp: number
}

export const getCoins = async ({
  signal,
}: IGetCoinsParams = {}): Promise<ICoinsResult> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const campaignId = process.env.NEXT_PUBLIC_COMPANY_ID
  const playerId = process.env.NEXT_PUBLIC_PLAYER_ID

  if (!baseUrl || !campaignId || !playerId)
    throw new Error("Не заданы переменные окружения для запроса монет.")

  const url = new URL("/api/coins", baseUrl)
  url.searchParams.set("campaignId", campaignId)
  url.searchParams.set("playerId", playerId)

  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error("Не удалось получить баланс монет.")

  const data = (await res.json()) as ICoinBalance
  if (!data.coins) throw new Error("Некорректный ответ баланса монет.")

  return { coins: data.coins, coinsCp: data.coinsCp }
}

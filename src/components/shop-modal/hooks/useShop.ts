"use client"

import { useEffect, useState } from "react"
import { useRefreshPurse } from "@/components/shared/purse"
import type { IShopData, IShopItem } from "../types"
import { getShop } from "../api/getShop"
import { buyItem } from "../api/buyItem"

interface IUseShopResult {
  shop: IShopData | null
  loading: boolean
  error: string | null
  buying: boolean
  buyError: string | null
  buy: (item: IShopItem, quantity: number) => Promise<void>
}

interface IUseShopParams {
  npcId: string
}

export const useShop = ({ npcId }: IUseShopParams): IUseShopResult => {
  const [shop, setShop] = useState<IShopData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [buying, setBuying] = useState(false)
  const [buyError, setBuyError] = useState<string | null>(null)
  const refreshPurse = useRefreshPurse()

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    getShop({ npcId, signal: controller.signal })
      .then(setShop)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return
        setShop(null)
        setError(
          err instanceof Error
            ? err.message
            : "Не удалось получить товары торговца.",
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [npcId])

  const reload = async () => {
    if (!shop) return
    setShop(await getShop({ npcId: shop.npcId }))
  }

  const buy = async (item: IShopItem, quantity: number) => {
    if (!shop) return
    setBuying(true)
    setBuyError(null)
    try {
      await buyItem({ npcId: shop.npcId, itemId: item.id, quantity })
      await reload()
      await refreshPurse()
    } catch (err: unknown) {
      setBuyError(
        err instanceof Error ? err.message : "Не удалось купить предмет.",
      )
    } finally {
      setBuying(false)
    }
  }

  return { shop, loading, error, buying, buyError, buy }
}

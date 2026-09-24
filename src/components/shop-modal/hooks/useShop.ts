"use client"

import { useEffect, useState } from "react"
import type { ITurnReply } from "@/components/shared/types"
import { useRefreshPurse } from "@/components/shared/purse"
import type { IShopData, IShopItem } from "../types"
import { getShop } from "../api/getShop"
import { buyItem } from "../api/buyItem"
import { postPurchaseNarration } from "../api/postPurchaseNarration"

interface IUseShopResult {
  shop: IShopData | null
  loading: boolean
  error: string | null
  buying: boolean
  buyError: string | null
  buySuccess: { itemName: string } | null
  cooldown: boolean
  buy: (item: IShopItem, quantity: number) => Promise<void>
}

interface IUseShopParams {
  npcId: string
  onPurchaseSuccess?: (replies: ITurnReply[]) => Promise<void>
  onPurchaseAwaitingChange?: (awaiting: boolean) => void
}

export const useShop = ({
  npcId,
  onPurchaseSuccess,
  onPurchaseAwaitingChange,
}: IUseShopParams): IUseShopResult => {
  const [shop, setShop] = useState<IShopData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [buying, setBuying] = useState(false)
  const [buyError, setBuyError] = useState<string | null>(null)
  const [buySuccess, setBuySuccess] = useState<{ itemName: string } | null>(
    null,
  )
  const [cooldown, setCooldown] = useState(false)
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
    setBuySuccess(null)
    try {
      await buyItem({ npcId: shop.npcId, itemId: item.id, quantity })
      await reload()
      await refreshPurse()

      setBuySuccess({ itemName: item.name })
      setTimeout(() => setBuySuccess(null), 2000)

      setCooldown(true)
      setTimeout(() => setCooldown(false), 1200)

      if (onPurchaseSuccess) {
        onPurchaseAwaitingChange?.(true)
        postPurchaseNarration({
          npcId: shop.npcId,
          itemName: item.name,
          quantity,
          totalPriceCp: item.priceCp * quantity,
        })
          .then(onPurchaseSuccess)
          .catch(() => {
            /* Narration failure should not undo the purchase */
          })
          .finally(() => {
            onPurchaseAwaitingChange?.(false)
          })
      }
    } catch (err: unknown) {
      setBuyError(
        err instanceof Error ? err.message : "Не удалось купить предмет.",
      )
    } finally {
      setBuying(false)
    }
  }

  return { shop, loading, error, buying, buyError, buySuccess, cooldown, buy }
}

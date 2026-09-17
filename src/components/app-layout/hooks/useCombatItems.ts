"use client"

import { useEffect, useState } from "react"
import type { IInventoryItem } from "@/components/shared/types"
import { getItems } from "@/components/inventory-modal/api/getItems"

interface IUseCombatItemsResult {
  items: IInventoryItem[]
  loading: boolean
}

export const useCombatItems = (): IUseCombatItemsResult => {
  const [items, setItems] = useState<IInventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    getItems({ signal: controller.signal })
      .then(setItems)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return
        setItems([])
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  return { items, loading }
}

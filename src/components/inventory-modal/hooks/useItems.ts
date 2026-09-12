"use client"

import { useEffect, useState } from "react"
import type { IInventoryItem } from "@/components/shared/types"
import { equipItem } from "../api/equipItem"
import { getItems } from "../api/getItems"
import { unequipItem } from "../api/unequipItem"
import { resolveEquipSlot } from "../helpers/resolveEquipSlot"

interface IUseItemsResult {
  items: IInventoryItem[]
  loading: boolean
  error: string | null
  busy: boolean
  actionError: string | null
  equip: (item: IInventoryItem) => Promise<void>
  unequip: (item: IInventoryItem) => Promise<void>
}

export const useItems = (): IUseItemsResult => {
  const [items, setItems] = useState<IInventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    getItems({ signal: controller.signal })
      .then(setItems)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return
        setItems([])
        setError(
          err instanceof Error
            ? err.message
            : "Не удалось получить предметы игрока.",
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  const reload = async () => {
    setItems(await getItems())
  }

  const equip = async (item: IInventoryItem) => {
    setBusy(true)
    setActionError(null)
    try {
      await equipItem({ itemId: item.id, slot: resolveEquipSlot(item) })
      await reload()
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "Не удалось надеть предмет.",
      )
    } finally {
      setBusy(false)
    }
  }

  const unequip = async (item: IInventoryItem) => {
    setBusy(true)
    setActionError(null)
    try {
      await unequipItem({ itemId: item.id })
      await reload()
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "Не удалось снять предмет.",
      )
    } finally {
      setBusy(false)
    }
  }

  return { items, loading, error, busy, actionError, equip, unequip }
}

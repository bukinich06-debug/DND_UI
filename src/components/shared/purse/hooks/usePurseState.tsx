"use client"
// ход уже показан — ошибка монет не валит UI

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import type { IPurse } from "@/components/shared/types"
import { getCoins } from "../api/getCoins"
import { diffUnits, type PurseUnit } from "../helpers/diffUnits"

const FLASH_MS = 2800

interface IPurseContextValue {
  purse: IPurse | null
  deltaCp: number
  changedUnits: PurseUnit[]
  refresh: () => Promise<void>
}

const PurseContext = createContext<IPurseContextValue | null>(null)

export const usePurseState = (): IPurseContextValue => {
  const [purse, setPurse] = useState<IPurse | null>(null)
  const [coinsCp, setCoinsCp] = useState<number | null>(null)
  const [deltaCp, setDeltaCp] = useState(0)
  const [changedUnits, setChangedUnits] = useState<PurseUnit[]>([])
  const coinsCpRef = useRef<number | null>(null)
  const purseRef = useRef<IPurse | null>(null)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    coinsCpRef.current = coinsCp
  }, [coinsCp])

  useEffect(() => {
    purseRef.current = purse
  }, [purse])

  useEffect(() => {
    const controller = new AbortController()

    getCoins({ signal: controller.signal })
      .then((data) => {
        setPurse(data.coins)
        setCoinsCp(data.coinsCp)
      })
      .catch((err: unknown) => {
        if (
          err instanceof
            DOMException &&
          err.name ===
            "AbortError"
        )
          return
        setPurse(null)
        setCoinsCp(null)
      })

    return () => {
      controller.abort()
      if (flashTimer.current) clearTimeout(flashTimer.current)
    }
  }, [])

  const clearFlash = () => {
    setDeltaCp(0)
    setChangedUnits([])
  }

  const refresh = async () => {
    try {
      const data = await getCoins()
      const prevCp = coinsCpRef.current
      const prevPurse = purseRef.current
      const nextDelta =
        prevCp ===
        null
          ? 0
          : data.coinsCp -
            prevCp

      setPurse(data.coins)
      setCoinsCp(data.coinsCp)

      if (
        nextDelta ===
          0 ||
        !prevPurse
      )
        return clearFlash()

      if (flashTimer.current) clearTimeout(flashTimer.current)
      setDeltaCp(nextDelta)
      setChangedUnits(diffUnits(prevPurse, data.coins))
      flashTimer.current = setTimeout(clearFlash, FLASH_MS)
    } catch {}
  }

  return { purse, deltaCp, changedUnits, refresh }
}

interface IPurseProviderProps {
  children: ReactNode
  value: IPurseContextValue
}

export const PurseContextProvider = ({
  children,
  value,
}: IPurseProviderProps) => (
  <PurseContext.Provider value={value}>{children}</PurseContext.Provider>
)

export const usePurseContext = (): IPurseContextValue => {
  const ctx = useContext(PurseContext)
  if (!ctx) throw new Error("usePurseContext вне PurseProvider.")
  return ctx
}

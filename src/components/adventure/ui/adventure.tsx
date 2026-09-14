"use client"

import { useState } from "react"
import type { IOpenShopSignal } from "@/components/shared/types"
import { WorldModal } from "@/components/world-modal"
import { AdventureHeader } from "../header"
import { useTurn } from "../hooks/useTurn"
import { AdventureLog } from "../log"
import { Composer } from "../composer"

interface IAdventureProps {
  onLocationChanged: () => void
  locationEpoch: number
  onShopOpen?: (signal: IOpenShopSignal) => void
}

export const Adventure = ({
  onLocationChanged,
  locationEpoch,
  onShopOpen,
}: IAdventureProps) => {
  const [worldOpen, setWorldOpen] = useState(false)
  const {
    entries,
    send,
    rollCheck,
    sending,
    locked,
    error,
    requestLocationLook,
  } = useTurn({ onLocationChanged, onShopOpen })

  const handleLocationMoved = async () => {
    setWorldOpen(false)
    onLocationChanged()
    await requestLocationLook()
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-background">
      <AdventureHeader
        onWorld={() => setWorldOpen(true)}
        locationEpoch={locationEpoch}
      />
      <AdventureLog
        entries={entries}
        sending={sending}
        onRoll={rollCheck}
        rolling={sending}
      />
      <Composer
        onSend={send}
        sending={locked}
        error={error}
        locationEpoch={locationEpoch}
      />
      {worldOpen && (
        <WorldModal
          onClose={() => setWorldOpen(false)}
          onMoved={() => void handleLocationMoved()}
        />
      )}
    </main>
  )
}

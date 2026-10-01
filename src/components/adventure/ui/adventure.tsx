"use client"

import { useState, useEffect } from "react"
import type { IOpenShopSignal, ITurnReply } from "@/components/shared/types"
import { WorldModal } from "@/components/world-modal"
import { AdventureHeader } from "../header"
import { useTurn } from "../hooks/useTurn"
import { AdventureLog } from "../log"
import { Composer } from "../composer"

interface IAdventureProps {
  onLocationChanged: () => void
  locationEpoch: number
  onShopOpen?: (signal: IOpenShopSignal) => void
  onAddPurchaseNarrationReady?: (
    callback: (replies: ITurnReply[]) => Promise<void>,
    beginAwaiting: () => void,
    endAwaiting: () => void,
  ) => void
}

export const Adventure = ({
  onLocationChanged,
  locationEpoch,
  onShopOpen,
  onAddPurchaseNarrationReady,
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
    addPurchaseNarration,
    beginAwaiting,
    endAwaiting,
  } = useTurn({ onLocationChanged, onShopOpen })

  useEffect(() => {
    if (onAddPurchaseNarrationReady) {
      onAddPurchaseNarrationReady(
        addPurchaseNarration,
        beginAwaiting,
        endAwaiting,
      )
    }
  }, [
    onAddPurchaseNarrationReady,
    addPurchaseNarration,
    beginAwaiting,
    endAwaiting,
  ])

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

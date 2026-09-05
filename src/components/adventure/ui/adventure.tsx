"use client"

import { useState } from "react"
import { WorldModal } from "@/components/world-modal"
import { AdventureHeader } from "../header"
import { useTurn } from "../hooks/useTurn"
import { AdventureLog } from "../log"
import { Composer } from "../composer"

interface IAdventureProps {
  onLocationChanged: () => void
  locationEpoch: number
}

export const Adventure = ({ onLocationChanged, locationEpoch }: IAdventureProps) => {
  const [worldOpen, setWorldOpen] = useState(false)
  const { entries, send, sending, error } = useTurn({ onLocationChanged })

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-background">
      <AdventureHeader onWorld={() => setWorldOpen(true)} locationEpoch={locationEpoch} />
      <AdventureLog entries={entries} sending={sending} />
      <Composer onSend={send} sending={sending} error={error} locationEpoch={locationEpoch} />
      {worldOpen && (
        <WorldModal
          onClose={() => setWorldOpen(false)}
          onMoved={() => {
            setWorldOpen(false)
            onLocationChanged()
          }}
        />
      )}
    </main>
  )
}

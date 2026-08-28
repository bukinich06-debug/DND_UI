"use client"

import { useState } from "react"
import { WorldModal } from "@/components/world-modal"
import { AdventureHeader } from "../header"
import { AdventureLog } from "../log"
import { Composer } from "../composer"

interface IAdventureProps {
  onLocationChanged: () => void
}

export const Adventure = ({ onLocationChanged }: IAdventureProps) => {
  const [worldOpen, setWorldOpen] = useState(false)

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-background">
      <AdventureHeader onWorld={() => setWorldOpen(true)} />
      <AdventureLog />
      <Composer />
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

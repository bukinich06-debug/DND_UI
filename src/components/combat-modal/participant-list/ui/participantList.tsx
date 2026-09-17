"use client"

import type { ICombatant } from "../../types"
import { ParticipantCard } from "../participant-card"

interface IParticipantListProps {
  combatants: ICombatant[]
}

export const ParticipantList = ({ combatants }: IParticipantListProps) => {
  const sorted = [...combatants].sort((a, b) => a.order - b.order)

  return (
    <div className="flex w-[240px] shrink-0 flex-col gap-3 overflow-y-auto border-r border-border p-4">
      {sorted.map((combatant) => (
        <ParticipantCard key={combatant.id} combatant={combatant} />
      ))}
    </div>
  )
}

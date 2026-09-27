"use client"

import type { ICombatant } from "../../types"
import { ParticipantCard } from "../participant-card"

interface IParticipantListProps {
  combatants: ICombatant[]
}

export const ParticipantList = ({ combatants }: IParticipantListProps) => {
  const playerCombatant = combatants.find((c) => c.type === "player")
  const playerPositionFeet = playerCombatant?.positionFeet ?? 0

  return (
    <div className="flex w-[240px] shrink-0 flex-col gap-3 overflow-y-auto border-r border-border p-4">
      {combatants.map((combatant) => (
        <ParticipantCard
          key={combatant.id}
          combatant={combatant}
          playerPositionFeet={playerPositionFeet}
        />
      ))}
    </div>
  )
}

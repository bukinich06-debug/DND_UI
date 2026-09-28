"use client"

import { useTranslations } from "next-intl"
import type { ICombatant, IWeaponSlot } from "../../types"
import type { IPlayer } from "@/components/character-panel/types"
import { WeaponSlot } from "../weapon-slot"
import { PotionSlot } from "../potion-slot"
import { ActionEconomyBar } from "../../action-economy-bar"

interface IAbilitiesPanelProps {
  weapons: IWeaponSlot[]
  combatants: ICombatant[]
  playerId: string
  potionCount: number
  player: IPlayer | null
  onAttack: (targetName: string, weaponName: string) => void
  isPlayerTurn: boolean
  isAnyActionInProgress: boolean
}

export const AbilitiesPanel = ({
  weapons,
  combatants,
  playerId,
  potionCount,
  player,
  onAttack,
  isPlayerTurn,
  isAnyActionInProgress,
}: IAbilitiesPanelProps) => {
  const t = useTranslations("combat")

  const playerCombatant = combatants.find((c) => c.playerId === playerId) || null

  return (
    <div className="flex w-[280px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-border bg-panel-alt p-4">
      <ActionEconomyBar
        playerCombatant={playerCombatant}
        isPlayerTurn={isPlayerTurn}
      />

      <div>
        <h3 className="mb-3 font-sans text-sm font-bold uppercase text-foreground">
          {t("weapons")}
        </h3>
        {weapons.length === 0 && (
          <p className="m-0 font-sans text-xs text-muted">
            {t("noWeapons")}
          </p>
        )}
        <div className="flex flex-col gap-3">
          {weapons.map((weapon) => (
            <WeaponSlot
              key={weapon.id}
              weapon={weapon}
              combatants={combatants}
              playerId={playerId}
              player={player}
              onAttack={onAttack}
              actionUsed={playerCombatant?.actionUsed ?? false}
              isPlayerTurn={isPlayerTurn}
              isAnyActionInProgress={isAnyActionInProgress}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-sans text-sm font-bold uppercase text-foreground">
          {t("potions")}
        </h3>
        {potionCount === 0 && (
          <p className="m-0 font-sans text-xs text-muted">
            {t("noPotions")}
          </p>
        )}
        {potionCount > 0 && (
          <PotionSlot
            count={potionCount}
            bonusActionUsed={playerCombatant?.bonusActionUsed ?? false}
            isPlayerTurn={isPlayerTurn}
          />
        )}
      </div>
    </div>
  )
}

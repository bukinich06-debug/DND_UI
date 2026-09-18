"use client"

import { useTranslations } from "next-intl"
import type { ICombatant, IWeaponSlot } from "../../types"
import type { IPlayer } from "@/components/character-panel/types"
import { WeaponSlot } from "../weapon-slot"
import { PotionSlot } from "../potion-slot"

interface IAbilitiesPanelProps {
  weapons: IWeaponSlot[]
  combatants: ICombatant[]
  playerId: string
  potionCount: number
  player: IPlayer | null
  onAttack: (targetName: string, weaponName: string) => void
}

export const AbilitiesPanel = ({
  weapons,
  combatants,
  playerId,
  potionCount,
  player,
  onAttack,
}: IAbilitiesPanelProps) => {
  const t = useTranslations("combat")

  return (
    <div className="flex w-[280px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-border bg-panel-alt p-4">
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
        {potionCount > 0 && <PotionSlot count={potionCount} />}
      </div>
    </div>
  )
}

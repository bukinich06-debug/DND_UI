"use client"

import { useTranslations } from "next-intl"
import { useEncounter } from "../hooks/useEncounter"
import { ParticipantList } from "../participant-list"
import { CombatChat } from "../combat-chat"
import { AbilitiesPanel } from "../abilities-panel"
import { getWeaponsFromInventory } from "../helpers/getWeaponsFromInventory"
import type { IInventoryItem } from "@/components/shared/types"

interface ICombatModalProps {
  items: IInventoryItem[]
  playerId: string
}

export const CombatModal = ({ items, playerId }: ICombatModalProps) => {
  const t = useTranslations("combat")
  const { encounter, loading } = useEncounter()

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-[4px]">
        <div className="flex h-[680px] w-full max-w-[1200px] items-center justify-center border border-border-light bg-panel shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
          <p className="m-0 font-sans text-sm text-muted">{t("loading")}</p>
        </div>
      </div>
    )
  }

  if (!encounter || !encounter.active) return null

  const weapons = getWeaponsFromInventory(items)

  const potions = items.filter(
    (item) =>
      item.kind === "consumable" &&
      item.name.toLowerCase().includes("heal"),
  )
  const potionCount = potions.reduce((sum, p) => sum + p.qty, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-[4px]">
      <div className="flex h-[680px] w-full max-w-[1200px] flex-col overflow-hidden border border-border-light bg-panel shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="m-0 font-sans text-[22px] font-bold uppercase text-foreground">
              {t("title")}
            </h2>
            <div className="mt-0.5 font-sans text-xs text-muted">
              {t("round", { number: encounter.round })}
            </div>
          </div>
          <div className="font-sans text-xs text-muted">
            {encounter.isPlayerTurn ? (
              <span className="font-bold text-accent">{t("yourTurn")}</span>
            ) : (
              t("enemyTurn")
            )}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <ParticipantList combatants={encounter.combatants} />
          <CombatChat log={encounter.log} isPlayerTurn={encounter.isPlayerTurn} />
          <AbilitiesPanel
            weapons={weapons}
            combatants={encounter.combatants}
            playerId={playerId}
            potionCount={potionCount}
          />
        </div>
      </div>
    </div>
  )
}

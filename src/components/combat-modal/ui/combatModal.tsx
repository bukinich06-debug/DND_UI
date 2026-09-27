"use client"

import { useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import { useEncounter } from "../hooks/useEncounter"
import { useAdvanceEncounter } from "../hooks/useAdvanceEncounter"
import { usePlayerCombatTurn } from "../hooks/usePlayerCombatTurn"
import { useEndPlayerTurn } from "../hooks/useEndPlayerTurn"
import { ParticipantList } from "../participant-list"
import { CombatChat } from "../combat-chat"
import { AbilitiesPanel } from "../abilities-panel"
import { CombatOutcome } from "../combat-outcome"
import { getWeaponsFromInventory } from "../helpers/getWeaponsFromInventory"
import type { IInventoryItem } from "@/components/shared/types"
import type { IPlayer } from "@/components/character-panel/types"
import type { ICombatOutcome } from "../types"

interface ICombatModalProps {
  items: IInventoryItem[]
  playerId: string
  player: IPlayer | null
}

export const CombatModal = ({ items, playerId, player }: ICombatModalProps) => {
  const t = useTranslations("combat")
  const { encounter, loading, networkError, setEncounter } = useEncounter()
  const {
    advance,
    loading: advanceLoading,
    error: advanceError,
  } = useAdvanceEncounter()
  const { endTurn, loading: endTurnLoading, error: endTurnError } = useEndPlayerTurn()

  const [message, setMessage] = useState("")
  const [agentMessage, setAgentMessage] = useState<string | null>(null)
  const [combatResult, setCombatResult] = useState<ICombatOutcome | null>(null)

  const {
    executeTurn,
    loading: playerTurnLoading,
    error: playerTurnError,
  } = usePlayerCombatTurn({
    encounterId: encounter?.id || "",
  })

  const handleAdvanceTurn = async () => {
    const result = await advance()
    if (result) {
      if (result.encounter) setEncounter(result.encounter)
      if (result.encounterEnded && result.encounterResult) {
        setCombatResult(result.encounterResult)
      }
    }
  }

  const handleEndTurn = async () => {
    const result = await endTurn()
    if (result) {
      if (result.encounter) setEncounter(result.encounter)
      if (result.encounterEnded && result.encounterResult) {
        setCombatResult(result.encounterResult)
      }
      setAgentMessage(null)
    }
  }

  const handlePlayerTurn = async (playerAction: string) => {
    if (!playerAction.trim()) return

    const result = await executeTurn(playerAction)
    if (result) {
      setEncounter(result.encounter)
      setMessage("")
      if (result.say) setAgentMessage(result.say)
      if (result.encounterEnded && result.encounterResult) {
        setCombatResult(result.encounterResult)
      }
    }
  }

  const handleAttack = (targetName: string, weaponName: string) => {
    const attackMessage = t("attackMessage", { targetName, weaponName })
    setMessage(attackMessage)
    handlePlayerTurn(attackMessage)
  }

  const handleCloseOutcome = useCallback(() => {
    setCombatResult(null)
    setEncounter(null)
  }, [setEncounter])

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-[4px]">
        <div className="flex h-[680px] w-full max-w-[1200px] items-center justify-center border border-border-light bg-panel shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
          <p className="m-0 font-sans text-sm text-muted">{t("loading")}</p>
        </div>
      </div>
    )
  }

  if (combatResult) {
    return <CombatOutcome outcome={combatResult} onClose={handleCloseOutcome} />
  }

  if (!encounter) {
    if (networkError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-[4px]">
          <div className="flex h-[680px] w-full max-w-[1200px] items-center justify-center border border-border-light bg-panel shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
            <p className="m-0 font-sans text-sm text-red-400">Ошибка сети. Повтор...</p>
          </div>
        </div>
      )
    }
    return null
  }

  if (!encounter.active) return null

  const weapons = getWeaponsFromInventory(items)

  const potions = items.filter(
    (item) =>
      item.kind === "consumable" &&
      item.name.toLowerCase().includes("heal"),
  )
  const potionCount = potions.reduce((sum, p) => sum + p.qty, 0)

  const playerCombatant = encounter.combatants.find((c) => c.playerId === playerId) || null
  const isPlayerUnconscious = playerCombatant && playerCombatant.hp === 0 && !playerCombatant.isStable && !playerCombatant.dead
  const isPlayerStable = playerCombatant && playerCombatant.isStable
  const isPlayerDead = playerCombatant && playerCombatant.dead
  const canPlayerAct = encounter.isPlayerTurn && !isPlayerUnconscious && !isPlayerStable && !isPlayerDead

  let disabledReason = null
  if (encounter.isPlayerTurn) {
    if (isPlayerDead) {
      disabledReason = t("cannotActDead")
    } else if (isPlayerStable) {
      disabledReason = t("cannotActStable")
    } else if (isPlayerUnconscious) {
      disabledReason = t("cannotActUnconscious")
    }
  }

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
          <div className="flex items-center gap-4">
            <div className="font-sans text-xs text-muted">
              {encounter.isPlayerTurn ? (
                <span className="font-bold text-accent">{t("yourTurn")}</span>
              ) : (
                t("enemyTurn")
              )}
            </div>
            {encounter.isPlayerTurn ? (
              isPlayerUnconscious || isPlayerStable ? (
                <button
                  onClick={handleAdvanceTurn}
                  disabled={advanceLoading}
                  className="cursor-pointer border border-accent bg-accent px-4 py-2 font-sans text-sm font-semibold text-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {advanceLoading
                    ? t("advancing")
                    : isPlayerUnconscious
                      ? t("rollDeathSave")
                      : t("skipTurn")}
                </button>
              ) : (
                <button
                  onClick={handleEndTurn}
                  disabled={endTurnLoading || !canPlayerAct}
                  className="cursor-pointer border border-accent bg-accent px-4 py-2 font-sans text-sm font-semibold text-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {endTurnLoading ? t("endingTurn") : t("endTurn")}
                </button>
              )
            ) : (
              <button
                onClick={handleAdvanceTurn}
                disabled={advanceLoading}
                className="cursor-pointer border border-accent bg-accent px-4 py-2 font-sans text-sm font-semibold text-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                {advanceLoading ? t("advancing") : t("nextTurn")}
              </button>
            )}
          </div>
        </div>

        {(advanceError || playerTurnError || endTurnError) && (
          <div className="border-b border-border bg-red-900/20 px-5 py-2">
            <p className="m-0 font-sans text-sm text-red-400">
              {advanceError || playerTurnError || endTurnError}
            </p>
          </div>
        )}

        {disabledReason && (
          <div className="border-b border-border bg-yellow-900/20 px-5 py-2">
            <p className="m-0 font-sans text-sm text-yellow-400">
              {disabledReason}
            </p>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          <ParticipantList combatants={encounter.combatants} />
          <CombatChat
            log={encounter.log}
            isPlayerTurn={canPlayerAct}
            message={message}
            onMessageChange={setMessage}
            onSubmit={handlePlayerTurn}
            loading={playerTurnLoading}
            agentMessage={agentMessage}
            onAgentMessageShown={() => setAgentMessage(null)}
          />
          <AbilitiesPanel
            weapons={weapons}
            combatants={encounter.combatants}
            playerId={playerId}
            potionCount={potionCount}
            player={player}
            onAttack={handleAttack}
            isPlayerTurn={canPlayerAct}
          />
        </div>
      </div>
    </div>
  )
}

"use client"

import { useTranslations } from "next-intl"
import type { ICombatLogEntry } from "../../types"
import { useRef, useEffect } from "react"

interface ICombatChatProps {
  log: ICombatLogEntry[]
  isPlayerTurn: boolean
  message: string
  onMessageChange: (message: string) => void
  onSubmit: (message: string) => void
  loading: boolean
}

const formatDiceRoll = (entry: ICombatLogEntry, t: (key: string) => string): string | null => {
  if (!entry.meta) return null

  const { attackRoll, attackBonus, attackTotal, targetAc, damageTotal, hpBefore, hpAfter } = entry.meta

  const parts: string[] = []

  if (attackRoll !== undefined && attackBonus !== undefined && attackTotal !== undefined) {
    const bonus = attackBonus >= 0 ? `+${attackBonus}` : `${attackBonus}`
    if (targetAc !== undefined) {
      parts.push(`d20 ${attackRoll} ${bonus} = ${attackTotal} ${t("vs")} AC ${targetAc}`)
    } else {
      parts.push(`d20 ${attackRoll} ${bonus} = ${attackTotal}`)
    }
  }

  if (damageTotal !== undefined && hpBefore !== undefined && hpAfter !== undefined) {
    parts.push(`${t("damage")} ${damageTotal} (${t("hp")} ${hpBefore}→${hpAfter})`)
  } else if (damageTotal !== undefined) {
    parts.push(`${t("damage")} ${damageTotal}`)
  }

  return parts.length > 0 ? parts.join(", ") : null
}

export const CombatChat = ({
  log,
  isPlayerTurn,
  message,
  onMessageChange,
  onSubmit,
  loading,
}: ICombatChatProps) => {
  const t = useTranslations("combat")
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [log])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !isPlayerTurn || loading) return
    onSubmit(message)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div
        ref={logRef}
        className="flex-1 overflow-y-auto border-b border-border bg-panel p-4"
      >
        {log.length === 0 && (
          <p className="m-0 font-sans text-sm text-muted">
            {t("logEmpty")}
          </p>
        )}
        {log.map((entry) => {
          const diceRoll = formatDiceRoll(entry, t)
          return (
            <div key={entry.id} className="mb-3">
              {entry.actorName && (
                <div className="mb-0.5 font-sans text-xs font-semibold text-accent">
                  {entry.actorName}
                </div>
              )}
              <div className="font-sans text-sm text-foreground">
                {entry.message}
              </div>
              {diceRoll && (
                <div className="mt-0.5 font-mono text-xs text-muted">
                  {diceRoll}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSubmit} className="shrink-0 p-4">
        <textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          disabled={!isPlayerTurn || loading}
          placeholder={
            isPlayerTurn ? t("chatPlaceholder") : t("chatDisabled")
          }
          className="w-full resize-none border border-border bg-panel-alt p-3 font-sans text-sm text-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50"
          rows={3}
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={!isPlayerTurn || !message.trim() || loading}
            className="cursor-pointer border border-accent bg-accent px-4 py-2 font-sans text-sm font-semibold text-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? t("sending") : t("send")}
          </button>
        </div>
      </form>
    </div>
  )
}

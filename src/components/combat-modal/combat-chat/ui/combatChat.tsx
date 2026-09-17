"use client"

import { useTranslations } from "next-intl"
import type { ICombatLogEntry } from "../../types"
import { useState, useRef, useEffect } from "react"

interface ICombatChatProps {
  log: ICombatLogEntry[]
  isPlayerTurn: boolean
}

export const CombatChat = ({ log, isPlayerTurn }: ICombatChatProps) => {
  const t = useTranslations("combat")
  const [message, setMessage] = useState("")
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [log])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !isPlayerTurn) return

    console.log("TODO: Send combat message:", message)
    setMessage("")
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
        {log.map((entry) => (
          <div key={entry.id} className="mb-3">
            {entry.actorName && (
              <div className="mb-0.5 font-sans text-xs font-semibold text-accent">
                {entry.actorName}
              </div>
            )}
            <div className="font-sans text-sm text-foreground">
              {entry.message}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="shrink-0 p-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!isPlayerTurn}
          placeholder={
            isPlayerTurn ? t("chatPlaceholder") : t("chatDisabled")
          }
          className="w-full resize-none border border-border bg-panel-alt p-3 font-sans text-sm text-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50"
          rows={3}
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={!isPlayerTurn || !message.trim()}
            className="cursor-pointer border border-accent bg-accent px-4 py-2 font-sans text-sm font-semibold text-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("send")}
          </button>
        </div>
      </form>
    </div>
  )
}

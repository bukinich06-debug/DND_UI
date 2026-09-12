"use client"

import { useTranslations } from "next-intl"
import { formatPurse } from "../helpers/formatPurse"
import { cpToPurse } from "../helpers/cpToPurse"
import { usePurse } from "../hooks/usePurse"
import { usePurseFlash } from "../hooks/usePurseFlash"

interface IPurseProps {
  className?: string
}

export const Purse = ({ className }: IPurseProps) => {
  const t = useTranslations("coins")
  const purse = usePurse()
  const { deltaCp, changedUnits } = usePurseFlash()

  if (!purse) return null

  const parts = formatPurse(purse)

  if (parts.length === 0 && deltaCp === 0) return null

  const isGain = deltaCp > 0
  const deltaParts = deltaCp !== 0 ? formatPurse(cpToPurse(deltaCp)) : []
  const flashClass = isGain ? "purse-flash-up" : "purse-flash-down"

  return (
    <span
      className={`relative inline-block ${className ?? "font-mono text-foreground-dim"}`}
    >
      {parts.map((part, i) => {
        const flashing = changedUnits.includes(part.unit)
        return (
          <span key={part.unit} className={flashing ? flashClass : undefined}>
            {i > 0 && (
              <span className="mx-1.5 inline-block text-border-light">·</span>
            )}
            {part.amount} {t(part.unit)}
          </span>
        )
      })}
      {deltaParts.length > 0 && (
        <span
          className="purse-delta pointer-events-none absolute bottom-full right-0 mb-0.5 whitespace-nowrap font-mono text-[12px] font-medium text-white"
          aria-hidden
        >
          {isGain ? "+" : "−"}
          {deltaParts.map((part, i) => (
            <span key={part.unit}>
              {i > 0 && " · "}
              {part.amount} {t(part.unit)}
            </span>
          ))}
        </span>
      )}
    </span>
  )
}

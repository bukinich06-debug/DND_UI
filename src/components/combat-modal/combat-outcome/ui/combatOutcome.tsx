"use client"

import { useTranslations } from "next-intl"
import type { ICombatOutcome } from "../../types"

interface ICombatOutcomeProps {
  outcome: ICombatOutcome
  onClose: () => void
}

export const CombatOutcome = ({ outcome, onClose }: ICombatOutcomeProps) => {
  const t = useTranslations("combat.outcome")

  const outcomeType = outcome.outcome || (outcome.victory ? "victory" : "defeat")
  const title = t(outcomeType)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-[4px]">
      <div className="flex w-full max-w-[500px] flex-col gap-6 border border-border-light bg-panel p-8 shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
        <h2 className="m-0 text-center font-sans text-[28px] font-bold uppercase text-foreground">
          {title}
        </h2>

        {outcomeType === "captured" && outcome.capturedBy && outcome.capturedBy.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="m-0 font-sans text-sm font-semibold uppercase text-muted">
              {t("capturedBy")}
            </h3>
            <ul className="m-0 list-none p-0">
              {outcome.capturedBy.map((name, idx) => (
                <li key={idx} className="mb-1 font-sans text-sm text-foreground">
                  • {name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {outcome.defeated.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="m-0 font-sans text-sm font-semibold uppercase text-muted">
              {t("defeated")}
            </h3>
            <ul className="m-0 list-none p-0">
              {outcome.defeated.map((name, idx) => (
                <li key={idx} className="mb-1 font-sans text-sm text-foreground">
                  • {name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {outcome.survivors.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="m-0 font-sans text-sm font-semibold uppercase text-accent">
              {t("survivors")}
            </h3>
            <ul className="m-0 list-none p-0">
              {outcome.survivors.map((name, idx) => (
                <li key={idx} className="mb-1 font-sans text-sm text-foreground">
                  • {name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onClose}
          className="cursor-pointer border border-accent bg-accent px-6 py-3 font-sans text-sm font-semibold uppercase text-background"
        >
          {t("close")}
        </button>
      </div>
    </div>
  )
}

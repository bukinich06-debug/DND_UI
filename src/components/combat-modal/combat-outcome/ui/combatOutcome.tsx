"use client"

import { useTranslations } from "next-intl"
import type { ICombatOutcome } from "../../types"

interface ICombatOutcomeProps {
  outcome: ICombatOutcome
  onClose: () => void
}

export const CombatOutcome = ({ outcome, onClose }: ICombatOutcomeProps) => {
  const t = useTranslations("combat.outcome")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-[4px]">
      <div className="flex w-full max-w-[500px] flex-col gap-6 border border-border-light bg-panel p-8 shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
        <h2 className="m-0 text-center font-sans text-[28px] font-bold uppercase text-foreground">
          {outcome.victory ? t("victory") : t("defeat")}
        </h2>

        {(outcome.xp !== undefined || outcome.coins !== undefined) && (
          <div className="flex flex-col gap-3">
            {outcome.xp !== undefined && (
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-sans text-sm text-muted">{t("xp")}</span>
                <span className="font-sans text-lg font-semibold text-accent">
                  +{outcome.xp}
                </span>
              </div>
            )}
            {outcome.coins !== undefined && (
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-sans text-sm text-muted">{t("coins")}</span>
                <span className="font-sans text-lg font-semibold text-accent">
                  +{outcome.coins} зм
                </span>
              </div>
            )}
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

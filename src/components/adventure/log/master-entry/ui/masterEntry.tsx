"use client"

import { useTranslations } from "next-intl"
import type { IMasterReply, MasterVerdict } from "@/components/shared/types"

interface IMasterEntryProps {
  entry: IMasterReply
}

const VERDICT_KEY: Record<MasterVerdict, "verdictAllowed" | "verdictDenied" | "verdictPartial" | "verdictCheck" | "verdictDeferCombat"> =
  {
    allowed: "verdictAllowed",
    denied: "verdictDenied",
    partial: "verdictPartial",
    check: "verdictCheck",
    defer_combat: "verdictDeferCombat",
  }

export const MasterEntry = ({ entry }: IMasterEntryProps) => {
  const t = useTranslations("center")
  const say = entry.say.trim()
  if (!say) return null

  return (
    <div className="mb-5">
      <div className="mb-1.5 flex items-baseline gap-2">
        <span className="font-sans text-[13px] tracking-wide text-foreground">
          {t("masterLabel")}
        </span>
        <span className="font-sans text-[11px] uppercase tracking-wide text-muted">
          {t(VERDICT_KEY[entry.verdict])}
        </span>
      </div>
      <p className="m-0 font-sans text-[15px] leading-[1.5] text-narration">
        {say}
      </p>
    </div>
  )
}

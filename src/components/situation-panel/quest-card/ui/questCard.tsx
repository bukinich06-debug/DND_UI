"use client"

import { useTranslations } from "next-intl"

export const QuestCard = () => {
  const t = useTranslations("sidebar")

  return (
    <div className="border border-border bg-panel p-2.5">
      <div className="mb-1.5 font-sans text-base font-semibold uppercase text-foreground">
        {t("questTitle")}
      </div>
      <div className="mb-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-[13px] text-muted">
          <span className="inline-block size-1.5 shrink-0 bg-accent" />
          {t("questObj1")}
        </div>
        <div className="flex items-center gap-1.5 text-[13px] text-muted">
          <span className="inline-block size-1.5 shrink-0 bg-border" />
          {t("questObj2")}
        </div>
        <div className="flex items-center gap-1.5 text-[13px] text-muted">
          <span className="inline-block size-1.5 shrink-0 bg-border" />
          {t("questObj3")}
        </div>
      </div>
      <div className="h-1 overflow-hidden bg-border">
        <div className="h-full w-[15%] bg-accent" />
      </div>
      <div className="mt-1 font-sans text-xs text-muted">
        {t("questProgress", { done: 1, total: 3 })}
      </div>
    </div>
  )
}

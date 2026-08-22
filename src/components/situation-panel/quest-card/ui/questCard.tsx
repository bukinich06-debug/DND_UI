"use client";

import { useTranslations } from "next-intl";

export const QuestCard = () => {
  const t = useTranslations("sidebar");

  return (
    <div className="rounded border border-border bg-panel p-2.5">
      <div className="mb-1.5 font-serif text-base text-parchment">{t("questTitle")}</div>
      <div className="mb-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-[11px] text-muted">
          <span className="inline-block size-1.5 shrink-0 rounded-full bg-gold" />
          {t("questObj1")}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted">
          <span className="inline-block size-1.5 shrink-0 rounded-full bg-border" />
          {t("questObj2")}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted">
          <span className="inline-block size-1.5 shrink-0 rounded-full bg-border" />
          {t("questObj3")}
        </div>
      </div>
      <div className="h-1 overflow-hidden rounded-[2px] bg-border">
        <div className="h-full w-[15%] rounded-[2px] bg-gold" />
      </div>
      <div className="mt-1 font-sans text-[10px] text-muted">{t("questProgress", { done: 1, total: 3 })}</div>
    </div>
  );
};

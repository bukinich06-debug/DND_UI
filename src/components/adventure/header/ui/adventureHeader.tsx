"use client";

import { useTranslations } from "next-intl";
import { IconBook, IconMap, IconSettings } from "@/components/shared/icon";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

export const AdventureHeader = () => {
  const t = useTranslations("center");
  const tNav = useTranslations("nav");

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-7 py-3.5">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="m-0 font-serif text-[22px] font-medium leading-none text-foreground">{t("location")}</h1>
          <span className="flex items-center gap-1.5 rounded-full border border-[#2e4038] bg-[#1a2420] px-[9px] py-0.5 font-sans text-[11px] text-system">
            <span className="inline-block size-1.5 animate-pulse rounded-full bg-system" />
            {t("aiDmActive")}
          </span>
        </div>
        <p className="mt-1 mb-0 font-sans text-[13px] text-muted">{t("situationLine")}</p>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1.5 rounded border border-border bg-transparent px-2.5 py-1.5 font-sans text-xs text-muted hover:border-border-light hover:text-foreground-dim"
        >
          <IconBook /> {tNav("journal")}
        </button>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1.5 rounded border border-border bg-transparent px-2.5 py-1.5 font-sans text-xs text-muted hover:border-border-light hover:text-foreground-dim"
        >
          <IconMap /> {tNav("world")}
        </button>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1.5 rounded border border-border bg-transparent px-2.5 py-1.5 font-sans text-xs text-muted hover:border-border-light hover:text-foreground-dim"
        >
          <IconSettings /> {tNav("settings")}
        </button>
      </div>
    </header>
  );
};

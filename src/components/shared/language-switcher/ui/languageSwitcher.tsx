"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export const LanguageSwitcher = () => {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (next: Locale) => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <div className="flex items-center overflow-hidden border border-border">
      {(["en", "ru"] as const).map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchLocale(code)}
            className={`cursor-pointer px-[9px] py-[5px] font-sans text-[13px] tracking-wide ${
              active
                ? "border-0 border-r-2 border-solid border-accent bg-panel-alt font-semibold text-foreground"
                : "border-0 bg-transparent font-normal text-muted"
            }`}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
};

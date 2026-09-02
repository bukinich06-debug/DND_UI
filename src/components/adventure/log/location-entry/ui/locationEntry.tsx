"use client";

import { useTranslations } from "next-intl";
import type { ILocationReply } from "@/components/shared/types";
import { useLocationEntry } from "../hooks/useLocationEntry";

interface ILocationEntryProps {
  entry: ILocationReply;
}

export const LocationEntry = ({ entry }: ILocationEntryProps) => {
  const t = useTranslations("center");
  const { open, toggle } = useLocationEntry();

  return (
    <div className="pb-6">
      <div className="mb-1.5 flex items-baseline gap-2">
        <span className="font-sans text-[13px] font-medium tracking-wide text-foreground">{entry.name}</span>
        {entry.isSecret && (
          <span className="font-sans text-[11px] uppercase tracking-wide text-muted">{t("locationSecret")}</span>
        )}
      </div>
      <p className="m-0 font-sans text-[15px] leading-[1.5] text-narration">{entry.summary}</p>
      {entry.features && <p className="mt-1.5 m-0 font-sans text-[13px] text-muted">{entry.features}</p>}
      {open && <p className="mt-3 m-0 font-sans text-[15px] leading-[1.5] text-narration">{entry.description}</p>}
      <button
        type="button"
        onClick={toggle}
        className="mt-2 cursor-pointer border-none bg-transparent p-0 font-sans text-[13px] text-accent hover:text-accent-dim"
      >
        {open ? t("locationHide") : t("locationRead")}
      </button>
    </div>
  );
};

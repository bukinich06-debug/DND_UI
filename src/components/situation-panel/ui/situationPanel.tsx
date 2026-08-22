"use client";

import { useTranslations } from "next-intl";
import { IconChevronRight } from "@/components/shared/icon";
import { Section, SectionDivider } from "@/components/shared/section";
import { NearbyList } from "../nearby-list";
import { PartyCard } from "../party-card";
import { QuestCard } from "../quest-card";
import type { ISituationPanelProps } from "../types";

export const SituationPanel = ({ open, onToggle }: ISituationPanelProps) => {
  const t = useTranslations("sidebar");

  return (
    <aside
      className={`relative shrink-0 overflow-hidden border-l border-border bg-background transition-[width] duration-300 ease-in-out ${
        open ? "w-[300px]" : "w-0"
      }`}
    >
      {open && (
        <div className="scrollable h-full overflow-y-auto py-3.5">
          <Section
            title={t("situation")}
            leading={
              <button
                type="button"
                onClick={onToggle}
                className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded border border-border bg-panel text-muted"
              >
                <IconChevronRight />
              </button>
            }
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span className="font-sans text-xs text-muted">{t("location")}</span>
                <span className="max-w-[60%] text-right font-sans text-xs text-foreground-dim">{t("locationValue")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-xs text-muted">{t("time")}</span>
                <span className="max-w-[60%] text-right font-sans text-xs text-foreground-dim">{t("timeValue")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-xs text-muted">{t("weather")}</span>
                <span className="max-w-[60%] text-right font-sans text-xs text-foreground-dim">{t("weatherValue")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-xs text-muted">{t("threat")}</span>
                <span className="max-w-[60%] text-right font-sans text-xs text-foreground-dim">{t("threatValue")}</span>
              </div>
            </div>
          </Section>

          <SectionDivider />

          <Section title={t("nearby")}>
            <NearbyList />
          </Section>

          <SectionDivider />

          <Section title={t("party")}>
            <PartyCard />
          </Section>

          <SectionDivider />

          <Section title={t("activeQuest")}>
            <QuestCard />
          </Section>
        </div>
      )}
    </aside>
  );
};

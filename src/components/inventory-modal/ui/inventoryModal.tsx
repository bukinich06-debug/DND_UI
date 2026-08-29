"use client";

import { IconSearch, IconX } from "@/components/shared/icon";
import { Purse } from "@/components/shared/purse";
import type { CategoryFilter } from "@/components/shared/types";
import { useTranslations } from "next-intl";
import { useInventoryFilter } from "../hooks/useInventoryFilter";
import { ItemDetail } from "../item-detail";
import { ItemList } from "../item-list";

const CATEGORY_FILTERS: CategoryFilter[] = ["all", "weapons", "armor", "consumables", "quest", "other"];

interface IInventoryModalProps {
  onClose: () => void;
}

export const InventoryModal = ({ onClose }: IInventoryModalProps) => {
  const t = useTranslations("inventory");
  const { items, search, setSearch, category, setCategory, selected, setSelected, filtered, totalWeight } =
    useInventoryFilter();
  const unit = t("unit");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-[4px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex h-[620px] w-full max-w-[860px] flex-col overflow-hidden border border-border-light bg-panel shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="m-0 font-sans text-[22px] font-bold uppercase text-foreground">{t("title")}</h2>
            <div className="mt-0.5 text-xs text-muted">
              {t("weight")}:{" "}
              <span className="font-mono text-foreground-dim">
                {t("weightValue", { total: totalWeight, max: 120, unit })}
              </span>
              <span className="mx-2 inline-block text-border-light">·</span>
              {t("purse")}: <Purse />
              <span className="mx-2 inline-block text-border-light">·</span>
              {t("itemsCount", { count: items.length })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute top-1/2 left-2.5 -translate-y-1/2 text-muted">
                <IconSearch />
              </span>
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[180px] border border-border-light bg-panel-alt py-[7px] pr-3 pl-8 font-sans text-[13px] text-foreground outline-none"
              />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 cursor-pointer items-center justify-center border border-border bg-transparent text-muted"
            >
              <IconX />
            </button>
          </div>
        </div>

        <div className="flex shrink-0 gap-1.5 border-b border-border px-5 py-2.5">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`cursor-pointer border px-3 py-1 font-sans text-xs ${
                category === cat ? "border-accent bg-panel-alt text-foreground" : "border-border bg-transparent text-muted"
              }`}
            >
              {t(`categories.${cat}`)}
            </button>
          ))}
        </div>

        <div className="flex flex-1 overflow-hidden">
          <ItemList items={filtered} selected={selected} onSelect={setSelected} empty={t("empty")} unit={unit} />
          {selected && <ItemDetail item={selected} unit={unit} />}
        </div>
      </div>
    </div>
  );
};

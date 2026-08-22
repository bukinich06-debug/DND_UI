import type { IInventoryItem } from "@/components/shared/types";
import { ItemIcon } from "../../helpers/itemIcon";
import { useTranslations } from "next-intl";

const RARITY_COLORS: Record<string, string> = {
  common: "#7a7060",
  uncommon: "#6b9e8a",
  rare: "#9a6bc4",
};

interface IItemListProps {
  items: IInventoryItem[];
  selected: IInventoryItem | null;
  onSelect: (item: IInventoryItem) => void;
  empty: string;
  unit: string;
}

export const ItemList = ({ items, selected, onSelect, empty, unit }: IItemListProps) => {
  const t = useTranslations("inventory");

  return (
    <div className="scrollable flex-1 overflow-y-auto border-r border-border">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item)}
          className={`flex w-full cursor-pointer items-center gap-3 border-none border-b border-[#1f1c18] px-5 py-[11px] text-left transition-colors hover:bg-[#1f1c18] ${
            selected?.id === item.id ? "bg-panel-alt hover:bg-panel-alt" : "bg-transparent"
          }`}
        >
          <span className="shrink-0 text-muted">
            <ItemIcon category={item.category} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm text-foreground">{item.name}</span>
              {item.qty > 1 && <span className="font-mono text-xs text-muted">×{item.qty}</span>}
              {item.equipped && (
                <span className="rounded-[2px] border border-[#2e4038] bg-[#1a2420] px-[5px] py-px text-[10px] text-system">{t("equipped")}</span>
              )}
              {item.rarity && item.rarity !== "common" && (
                <span className="text-[10px]" style={{ color: RARITY_COLORS[item.rarity] }}>
                  ◆
                </span>
              )}
            </div>
            <div className="font-sans text-[11px] text-muted">
              {t("categoryWeight", {
                category: t(`categories.${item.category}`),
                weight: item.weight,
                unit,
              })}
            </div>
          </div>
        </button>
      ))}
      {items.length === 0 && (
        <div className="px-5 py-8 text-center font-serif text-sm text-muted italic">{empty}</div>
      )}
    </div>
  );
};

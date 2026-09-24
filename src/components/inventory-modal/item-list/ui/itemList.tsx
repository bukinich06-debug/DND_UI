import type { IInventoryItem } from "@/components/shared/types"
import { ItemIcon } from "../../helpers/itemIcon"
import { RARITY_COLORS } from "../../helpers/rarityColors"
import { useTranslations } from "next-intl"

interface IItemListProps {
  items: IInventoryItem[]
  selected: IInventoryItem | null
  onSelect: (item: IInventoryItem) => void
  empty: string
  unit: string
}

export const ItemList = ({
  items,
  selected,
  onSelect,
  empty,
  unit,
}: IItemListProps) => {
  const t = useTranslations("inventory")

  return (
    <div className="scrollable flex-1 overflow-y-auto border-r border-border">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item)}
          className={`flex w-full cursor-pointer items-center gap-3 border-none border-b border-border px-5 py-[11px] text-left transition-colors hover:bg-panel ${
            selected?.id === item.id
              ? "bg-panel-alt hover:bg-panel-alt"
              : "bg-transparent"
          }`}
        >
          <span className="shrink-0 text-muted">
            <ItemIcon category={item.category} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm text-foreground">
                {item.name}
              </span>
              {item.qty > 1 && (
                <span className="font-mono text-xs text-muted">
                  ×{item.qty}
                </span>
              )}
              {item.equipped && item.equipSlot && (
                <span className="border border-border bg-panel-alt px-[5px] py-px text-xs text-system">
                  {t(`equipSlot.${item.equipSlot}`)}
                </span>
              )}
              {item.rarity && item.rarity !== "common" && (
                <span
                  className="text-xs"
                  style={{ color: RARITY_COLORS[item.rarity] }}
                >
                  ◆
                </span>
              )}
            </div>
            <div className="font-sans text-[13px] text-muted">
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
        <div className="px-5 py-8 text-center font-sans text-sm text-muted italic">
          {empty}
        </div>
      )}
    </div>
  )
}

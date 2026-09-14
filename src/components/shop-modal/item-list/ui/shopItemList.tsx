import type { IShopItem } from "../types"

interface IShopItemListProps {
  items: IShopItem[]
  selected: IShopItem | null
  onSelect: (item: IShopItem) => void
  empty: string
  playerCoinsCp: number
}

export const ShopItemList = ({
  items,
  selected,
  onSelect,
  empty,
  playerCoinsCp,
}: IShopItemListProps) => {
  return (
    <div className="scrollable flex-1 overflow-y-auto border-r border-border">
      {items.map((item) => {
        const canAfford = item.priceCp <= playerCoinsCp
        return (
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
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-sans text-sm text-foreground">
                  {item.name}
                </span>
                {item.quantity > 1 && (
                  <span className="font-mono text-xs text-muted">
                    ×{item.quantity}
                  </span>
                )}
                {item.isMagical && (
                  <span className="text-xs text-accent">★</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-sans text-[13px] text-muted">
                  {item.kind}
                </span>
                <span className="text-border-light">·</span>
                <span
                  className={`font-mono text-[13px] ${canAfford ? "text-foreground-dim" : "text-combat"}`}
                >
                  {item.priceFormatted}
                </span>
              </div>
            </div>
          </button>
        )
      })}
      {items.length === 0 && (
        <div className="px-5 py-8 text-center font-sans text-sm text-muted italic">
          {empty}
        </div>
      )}
    </div>
  )
}

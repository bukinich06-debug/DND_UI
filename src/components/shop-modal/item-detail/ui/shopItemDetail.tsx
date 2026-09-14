import { useState } from "react"
import { useTranslations } from "next-intl"
import type { IShopItem } from "../types"
import { ActionBtn } from "@/components/shared/action-btn"

interface IShopItemDetailProps {
  item: IShopItem
  playerCoinsCp: number
  buying: boolean
  buyError: string | null
  onBuy: (item: IShopItem, quantity: number) => void
}

export const ShopItemDetail = ({
  item,
  playerCoinsCp,
  buying,
  buyError,
  onBuy,
}: IShopItemDetailProps) => {
  const t = useTranslations("shop")
  const [quantity, setQuantity] = useState(1)

  const canAfford = item.priceCp * quantity <= playerCoinsCp
  const maxQuantity = Math.min(
    item.quantity,
    Math.floor(playerCoinsCp / item.priceCp),
  )

  return (
    <div className="scrollable w-[280px] shrink-0 overflow-y-auto p-5">
      <div className="mb-1 flex items-center gap-2">
        {item.isMagical && <span className="text-lg text-accent">★</span>}
        <h3 className="m-0 font-sans text-xl font-bold uppercase text-foreground">
          {item.name}
        </h3>
      </div>
      <div className="mb-3.5 font-sans text-xs text-muted">
        {item.kind}
        {item.rarity && item.rarity !== "common" && (
          <span className="ml-2 text-accent">{item.rarity}</span>
        )}
      </div>
      <p className="mb-4 font-sans text-[15px] leading-[1.5] text-foreground-dim italic">
        &ldquo;{item.description}&rdquo;
      </p>
      <div className="mb-3 border border-border bg-panel-alt p-2">
        <div className="text-[11px] uppercase tracking-widest text-muted">
          {t("price")}
        </div>
        <div
          className={`font-mono text-sm ${canAfford ? "text-foreground" : "text-combat"}`}
        >
          {item.priceFormatted}
        </div>
      </div>
      {item.quantity > 1 && (
        <div className="mb-3">
          <label className="mb-1.5 block text-[11px] uppercase tracking-widest text-muted">
            {t("quantity")}
          </label>
          <input
            type="number"
            min={1}
            max={maxQuantity}
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10)
              if (!isNaN(val) && val >= 1 && val <= maxQuantity) {
                setQuantity(val)
              }
            }}
            disabled={buying}
            className="w-full border border-border bg-panel px-3 py-2 font-mono text-sm text-foreground outline-none disabled:opacity-50"
          />
          <div className="mt-1 text-xs text-muted">
            {t("available")}: {item.quantity} · {t("canAfford")}: {maxQuantity}
          </div>
        </div>
      )}
      {buyError && (
        <p className="mb-3 m-0 font-sans text-xs text-combat">{buyError}</p>
      )}
      <ActionBtn
        label={
          quantity > 1
            ? `${t("buy")} (${quantity}x ${formatPrice(item.priceCp * quantity)})`
            : t("buy")
        }
        primary
        disabled={buying || !canAfford || quantity > item.quantity}
        onClick={() => onBuy(item, quantity)}
      />
    </div>
  )
}

const formatPrice = (cp: number): string => {
  const gp = Math.floor(cp / 100)
  const sp = Math.floor((cp % 100) / 10)
  const cpRest = cp % 10

  const parts: string[] = []
  if (gp > 0) parts.push(`${gp}зм`)
  if (sp > 0) parts.push(`${sp}см`)
  if (cpRest > 0) parts.push(`${cpRest}мм`)

  return parts.join(" ")
}

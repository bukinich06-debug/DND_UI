"use client"

import { useEffect, useState } from "react"
import { IconX } from "@/components/shared/icon"
import { Purse } from "@/components/shared/purse"
import { useTranslations } from "next-intl"
import { useShop } from "../hooks/useShop"
import { ShopItemList } from "../item-list"
import { ShopItemDetail } from "../item-detail"
import { SuccessToast } from "../success-toast"
import type { IShopItem } from "../types"

interface IShopModalProps {
  npcId: string
  onClose: () => void
}

export const ShopModal = ({ npcId, onClose }: IShopModalProps) => {
  const t = useTranslations("shop")
  const { shop, loading, error, buying, buyError, buySuccess, cooldown, buy } =
    useShop({ npcId })
  const [selected, setSelected] = useState<IShopItem | null>(null)

  useEffect(() => {
    if (!shop || !selected) return
    const stillAvailable = shop.items.some((item) => item.id === selected.id)
    if (!stillAvailable) setSelected(null)
  }, [shop, selected])

  let listArea = (
    <div className="flex flex-1 overflow-hidden">
      {shop && (
        <>
          <ShopItemList
            items={shop.items}
            selected={selected}
            onSelect={setSelected}
            empty={t("empty")}
            playerCoinsCp={shop.playerCoinsCp}
          />
          {selected && (
            <ShopItemDetail
              item={selected}
              playerCoinsCp={shop.playerCoinsCp}
              buying={buying}
              buyError={buyError}
              cooldown={cooldown}
              onBuy={buy}
            />
          )}
        </>
      )}
    </div>
  )

  if (loading)
    listArea = (
      <p className="m-0 flex-1 px-5 py-8 font-sans text-sm text-muted">
        {t("loading")}
      </p>
    )

  if (error)
    listArea = (
      <p className="m-0 flex-1 px-5 py-8 font-sans text-sm text-combat">
        {t("error")}
      </p>
    )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-[4px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex h-[620px] w-full max-w-[860px] flex-col overflow-hidden border border-border-light bg-panel shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="m-0 font-sans text-[22px] font-bold uppercase text-foreground">
              {shop ? shop.npcName : t("title")}
            </h2>
            <div className="mt-0.5 text-xs text-muted">
              {shop && (
                <>
                  <span className="text-foreground-dim">
                    {shop.specialtyName}
                  </span>
                  <span className="mx-2 inline-block text-border-light">
                    ·
                  </span>
                </>
              )}
              {t("purse")}: <Purse />
              {shop && (
                <>
                  <span className="mx-2 inline-block text-border-light">
                    ·
                  </span>
                  {t("itemsCount", { count: shop.items.length })}
                </>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 cursor-pointer items-center justify-center border border-border bg-transparent text-muted"
          >
            <IconX />
          </button>
        </div>

        {listArea}

        {buySuccess && <SuccessToast itemName={buySuccess.itemName} />}
      </div>
    </div>
  )
}

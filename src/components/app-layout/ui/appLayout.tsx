"use client"

import { useState } from "react"
import type { IOpenShopSignal, ITurnReply } from "@/components/shared/types"
import { Adventure } from "@/components/adventure"
import { CharacterPanel } from "@/components/character-panel"
import { InventoryModal } from "@/components/inventory-modal"
import { ShopModal } from "@/components/shop-modal"
import { SituationPanel } from "@/components/situation-panel"
import { CombatModal } from "@/components/combat-modal"
import { IconChevronLeft } from "@/components/shared/icon"
import { PurseProvider } from "@/components/shared/purse"
import { useShell } from "../hooks/useShell"
import { useCombatItems } from "../hooks/useCombatItems"
import { usePlayer } from "@/components/character-panel/hooks/usePlayer"

export const AppLayout = () => {
  const {
    rightOpen,
    setRightOpen,
    inventoryOpen,
    setInventoryOpen,
    shopSignal,
    setShopSignal,
    activeTab,
    setActiveTab,
    locationEpoch,
    bumpLocation,
  } = useShell()

  const { items, loading: itemsLoading } = useCombatItems()
  const player = usePlayer()

  const [addPurchaseNarration, setAddPurchaseNarration] = useState<
    ((replies: ITurnReply[]) => Promise<void>) | null
  >(null)
  const [beginAwaiting, setBeginAwaiting] = useState<(() => void) | null>(null)
  const [endAwaiting, setEndAwaiting] = useState<(() => void) | null>(null)

  const playerId = process.env.NEXT_PUBLIC_PLAYER_ID ?? ""

  return (
    <PurseProvider>
      <div className="relative flex h-full w-full overflow-hidden bg-background">
        <CharacterPanel
          onInventory={() => setInventoryOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <Adventure
          onLocationChanged={bumpLocation}
          locationEpoch={locationEpoch}
          onShopOpen={(signal: IOpenShopSignal) => setShopSignal(signal)}
          onAddPurchaseNarrationReady={(callback, begin, end) => {
            setAddPurchaseNarration(() => callback)
            setBeginAwaiting(() => begin)
            setEndAwaiting(() => end)
          }}
        />

        {!rightOpen && (
          <button
            type="button"
            onClick={() => setRightOpen(true)}
            className="absolute top-3.5 right-0 z-10 flex size-7 cursor-pointer items-center justify-center border border-border bg-panel text-muted"
          >
            <IconChevronLeft />
          </button>
        )}

        <SituationPanel
          open={rightOpen}
          onToggle={() => setRightOpen((o) => !o)}
          locationEpoch={locationEpoch}
        />

        {inventoryOpen && (
          <InventoryModal onClose={() => setInventoryOpen(false)} />
        )}

        {shopSignal && (
          <ShopModal
            npcId={shopSignal.npcId}
            onClose={() => setShopSignal(null)}
            onPurchaseSuccess={addPurchaseNarration ?? undefined}
            onPurchaseAwaitingChange={(awaiting) => {
              if (awaiting) beginAwaiting?.()
              else endAwaiting?.()
            }}
          />
        )}

        {!itemsLoading && (
          <CombatModal items={items} playerId={playerId} player={player} />
        )}
      </div>
    </PurseProvider>
  )
}

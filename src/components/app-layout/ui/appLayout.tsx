"use client"

import { Adventure } from "@/components/adventure"
import { CharacterPanel } from "@/components/character-panel"
import { InventoryModal } from "@/components/inventory-modal"
import { ShopModal } from "@/components/shop-modal"
import { SituationPanel } from "@/components/situation-panel"
import { IconChevronLeft } from "@/components/shared/icon"
import { PurseProvider } from "@/components/shared/purse"
import type { IOpenShopSignal } from "@/components/shared/types"
import { useShell } from "../hooks/useShell"

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
          />
        )}
      </div>
    </PurseProvider>
  )
}

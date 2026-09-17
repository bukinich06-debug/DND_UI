import type { IInventoryItem } from "@/components/shared/types"
import { ActionBtn } from "@/components/shared/action-btn"
import { ItemIcon } from "../../helpers/itemIcon"
import { canEquip } from "../../helpers/resolveEquipSlot"
import { RARITY_COLORS } from "../../helpers/rarityColors"
import { useTranslations } from "next-intl"

interface IItemDetailProps {
  item: IInventoryItem
  unit: string
  busy: boolean
  actionError: string | null
  onEquip: (item: IInventoryItem) => void
  onUnequip: (item: IInventoryItem) => void
}

export const ItemDetail = ({
  item,
  unit,
  busy,
  actionError,
  onEquip,
  onUnequip,
}: IItemDetailProps) => {
  const t = useTranslations("inventory")

  return (
    <div className="scrollable w-[280px] shrink-0 overflow-y-auto p-5">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-accent">
          <ItemIcon category={item.category} />
        </span>
        <h3 className="m-0 font-sans text-xl font-bold uppercase text-foreground">
          {item.name}
        </h3>
      </div>
      <div className="mb-3.5 font-sans text-xs text-muted">
        {t(`categories.${item.category}`)}
        {item.rarity && item.rarity !== "common" && (
          <span className="ml-2" style={{ color: RARITY_COLORS[item.rarity] }}>
            {t(`rarity.${item.rarity}`)}
          </span>
        )}
      </div>
      <p className="mb-4 font-sans text-[15px] leading-[1.5] text-foreground-dim italic">
        &ldquo;{item.description}&rdquo;
      </p>
      {item.properties && (
        <div className="mb-4">
          <div className="mb-1.5 text-xs uppercase tracking-widest text-muted">
            {t("properties")}
          </div>
          {item.properties.map((p, idx) => (
            <div
              key={idx}
              className="border-b border-border py-[3px] font-sans text-xs text-foreground-dim"
            >
              {p.text}
            </div>
          ))}
        </div>
      )}
      <div className="mb-3 flex gap-2">
        <div className="flex-1 border border-border bg-panel-alt p-2 text-center">
          <div className="text-[11px] uppercase tracking-widest text-muted">
            {t("weight")}
          </div>
          <div className="font-mono text-sm text-foreground">
            {item.weight} {unit}
          </div>
        </div>
        <div className="flex-1 border border-border bg-panel-alt p-2 text-center">
          <div className="text-[11px] uppercase tracking-widest text-muted">
            {t("value")}
          </div>
          <div className="font-mono text-sm text-foreground">{item.value}</div>
        </div>
      </div>
      {actionError && (
        <p className="mb-3 m-0 font-sans text-xs text-combat">{actionError}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {item.equipped && (
          <ActionBtn
            label={t("actions.unequip")}
            disabled={busy}
            onClick={() => onUnequip(item)}
          />
        )}
        {canEquip(item) && (
          <ActionBtn
            label={t("actions.equip")}
            primary
            disabled={busy}
            onClick={() => onEquip(item)}
          />
        )}
        {item.category === "consumables" && (
          <ActionBtn label={t("actions.use")} primary disabled={busy} />
        )}
        <ActionBtn label={t("actions.inspect")} disabled={busy} />
        {item.category !== "quest" && (
          <ActionBtn label={t("actions.drop")} danger disabled={busy} />
        )}
      </div>
    </div>
  )
}

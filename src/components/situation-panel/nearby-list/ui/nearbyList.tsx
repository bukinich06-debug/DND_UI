"use client"

import { useTranslations } from "next-intl"
import { IconUser } from "@/components/shared/icon"
import { useNearby } from "../hooks/useNearby"

interface INearbyListProps {
  locationEpoch: number
}

export const NearbyList = ({ locationEpoch }: INearbyListProps) => {
  const t = useTranslations("sidebar")
  const { npcs, loading, error } = useNearby(locationEpoch)

  if (loading)
    return (
      <p className="m-0 px-1.5 font-sans text-[13px] text-muted">
        {t("nearbyLoading")}
      </p>
    )

  if (error)
    return (
      <p className="m-0 px-1.5 font-sans text-[13px] text-combat">
        {t("nearbyError")}
      </p>
    )

  if (!npcs.length)
    return (
      <p className="m-0 px-1.5 font-sans text-[13px] text-muted">
        {t("nearbyEmpty")}
      </p>
    )

  return (
    <div className="flex flex-col gap-1">
      {npcs.map((row) => (
        <button
          key={row.npc.id}
          type="button"
          className="flex w-full cursor-pointer items-center gap-2 border border-transparent bg-transparent px-1.5 py-1 text-left hover:border-border hover:bg-panel"
        >
          <span className="shrink-0 text-muted">
            <IconUser />
          </span>
          <div>
            <div className="font-sans text-[13px] text-foreground">
              {row.npc.name}
            </div>
            {row.role && (
              <div className="text-[13px] text-muted">{row.role}</div>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}

"use client"

import { IconX } from "@/components/shared/icon"
import { useTranslations } from "next-intl"
import { usePanZoom } from "../hooks/usePanZoom"
import { useWorldMap } from "../hooks/useWorldMap"
import { WorldSchema } from "../schema"

interface IWorldModalProps {
  onClose: () => void
  onMoved: () => void
}

export const WorldModal = ({ onClose, onMoved }: IWorldModalProps) => {
  const t = useTranslations("world")
  const {
    loading,
    error,
    moving,
    layout,
    tree,
    roads,
    currentId,
    travel,
    moveTo,
  } = useWorldMap(onMoved)
  const pan = usePanZoom()

  let body
  if (loading)
    body = (
      <p className="m-0 px-5 py-8 font-sans text-sm text-muted">
        {t("loading")}
      </p>
    )
  else if (!layout.nodes.length)
    body = (
      <p className="m-0 px-5 py-8 font-sans text-sm text-muted">{t("empty")}</p>
    )
  else
    body = (
      <WorldSchema
        width={layout.width}
        height={layout.height}
        nodes={layout.nodes}
        tree={tree}
        roads={roads}
        currentId={currentId}
        travel={travel}
        moving={moving}
        panX={pan.x}
        panY={pan.y}
        scale={pan.scale}
        onWheel={pan.onWheel}
        onPointerDown={pan.onPointerDown}
        onPointerMove={pan.onPointerMove}
        onPointerUp={pan.onPointerUp}
        onMove={moveTo}
      />
    )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-[4px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex h-[85vh] w-full max-w-[1200px] flex-col overflow-hidden rounded-md border border-border-light bg-panel shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <h2 className="m-0 font-serif text-[22px] font-medium text-foreground">
              {t("title")}
            </h2>
            {error && (
              <p className="mt-1 mb-0 font-sans text-xs text-combat">{error}</p>
            )}
            {travel && !error && (
              <p className="mt-1 mb-0 font-sans text-xs text-gold">
                {t("travelTo", { name: travel.destination.name })} ·{" "}
                {t("travelLeft", { count: travel.daysLeft })}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 cursor-pointer items-center justify-center rounded border border-border bg-transparent text-muted"
          >
            <IconX />
          </button>
        </div>
        {body}
      </div>
    </div>
  )
}

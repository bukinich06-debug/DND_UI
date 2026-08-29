"use client"

import { useTranslations } from "next-intl"
import type { PointerEvent, WheelEvent } from "react"
import { LocationCard } from "../../location-card"
import type {
  ILayoutNode,
  IPlayerTravel,
  IRoadEdge,
  ITreeEdge,
  LocationKind,
} from "../../types"

const KINDS: LocationKind[] = [
  "region",
  "settlement",
  "district",
  "building",
  "room",
  "dungeon",
  "wilderness",
  "other",
]

const kindKey = (kind: LocationKind): LocationKind =>
  KINDS.includes(kind) ? kind : "other"

interface IWorldSchemaProps {
  width: number
  height: number
  nodes: ILayoutNode[]
  tree: ITreeEdge[]
  roads: IRoadEdge[]
  currentId: string | null
  travel: IPlayerTravel | null
  moving: boolean
  panX: number
  panY: number
  scale: number
  onWheel: (e: WheelEvent) => void
  onPointerDown: (e: PointerEvent) => void
  onPointerMove: (e: PointerEvent) => void
  onPointerUp: () => void
  onMove: (id: string) => void
}

interface IRoadLabelProps {
  edge: IRoadEdge
  travel: IPlayerTravel | null
}

const RoadLabel = ({ edge, travel }: IRoadLabelProps) => {
  const t = useTranslations("world")
  const parts = [t("days", { count: edge.days })]
  if (edge.currentLeg && travel)
    parts.push(t("travelLeft", { count: travel.daysLeft }))
  if (edge.label) parts.push(edge.label)

  return (
    <div
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 border border-accent-dim bg-panel px-1.5 py-0.5 font-sans text-[10px] whitespace-nowrap text-accent"
      style={{ left: edge.labelX, top: edge.labelY }}
    >
      {parts.join(" · ")}
    </div>
  )
}

export const WorldSchema = ({
  width,
  height,
  nodes,
  tree,
  roads,
  currentId,
  travel,
  moving,
  panX,
  panY,
  scale,
  onWheel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onMove,
}: IWorldSchemaProps) => {
  const t = useTranslations("world")

  return (
    <div
      className="relative min-h-0 flex-1 cursor-grab overflow-hidden active:cursor-grabbing"
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div
        className="origin-top-left"
        style={{
          width,
          height: Math.max(height, 400),
          transform: `translate(${panX}px, ${panY}px) scale(${scale})`,
        }}
      >
        <svg
          className="pointer-events-none absolute inset-0"
          width={width}
          height={height}
          aria-hidden
        >
          <defs>
            <marker
              id="world-road-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M0 0 L8 4 L0 8 Z" fill="#c41e3a" />
            </marker>
          </defs>
          {tree.map((edge) => (
            <path
              key={`${edge.fromId}-${edge.toId}`}
              d={edge.d}
              fill="none"
              stroke="#333333"
              strokeWidth="1.5"
            />
          ))}
          {roads.map((edge) => (
            <path
              key={edge.id}
              d={edge.d}
              fill="none"
              stroke={edge.onRoute ? "#c41e3a" : "#8a1528"}
              strokeWidth={edge.currentLeg ? 2.5 : 1.5}
              strokeDasharray="6 4"
              markerEnd="url(#world-road-arrow)"
            />
          ))}
        </svg>
        {roads.map((edge) => (
          <RoadLabel key={`lbl-${edge.id}`} edge={edge} travel={travel} />
        ))}
        {nodes.map((node) => (
          <LocationCard
            key={node.loc.id}
            name={node.loc.name}
            summary={node.loc.summary}
            kindLabel={t(`kinds.${kindKey(node.loc.kind)}`)}
            hereLabel={t("here")}
            isHere={node.loc.id === currentId}
            disabled={moving || node.loc.id === currentId}
            x={node.x}
            y={node.y}
            onClick={() => onMove(node.loc.id)}
          />
        ))}
      </div>
    </div>
  )
}

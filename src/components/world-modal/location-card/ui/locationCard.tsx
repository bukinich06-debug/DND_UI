interface ILocationCardProps {
  name: string
  summary: string
  kindLabel: string
  hereLabel: string
  isHere: boolean
  disabled: boolean
  x: number
  y: number
  onClick: () => void
}

export const LocationCard = ({
  name,
  summary,
  kindLabel,
  hereLabel,
  isHere,
  disabled,
  x,
  y,
  onClick,
}: ILocationCardProps) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    onPointerDown={(e) => e.stopPropagation()}
    style={{ left: x, top: y }}
    className={`absolute box-border flex w-[200px] cursor-pointer flex-col items-start border px-2.5 py-2 text-left font-sans ${
      isHere
        ? "border-accent bg-panel-alt"
        : "border-border bg-panel hover:border-border-light"
    } disabled:cursor-default`}
  >
    <span className="text-[10px] tracking-wide text-muted uppercase">
      {kindLabel}
    </span>
    <span className="mt-0.5 font-sans text-sm font-semibold text-foreground">
      {name}
    </span>
    {summary && (
      <span className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted">
        {summary}
      </span>
    )}
    {isHere && (
      <span className="mt-1.5 text-[11px] text-accent">{hereLabel}</span>
    )}
  </button>
)

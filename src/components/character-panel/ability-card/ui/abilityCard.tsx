interface IAbilityCardProps {
  name: string
  score: number
}

export const AbilityCard = ({ name, score }: IAbilityCardProps) => {
  const mod = Math.floor((score - 10) / 2)
  const modStr = mod >= 0 ? `+${mod}` : `${mod}`

  return (
    <div className="flex flex-col items-center gap-0.5 border border-border bg-panel py-1.5">
      <span className="font-sans text-[11px] font-medium uppercase tracking-wide text-muted">
        {name}
      </span>
      <span className="font-mono text-[15px] font-medium leading-none text-foreground">
        {score}
      </span>
      <span className="font-mono text-[13px] text-accent">{modStr}</span>
    </div>
  )
}

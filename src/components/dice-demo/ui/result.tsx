import { useTranslations } from "next-intl"
import type { IRoll } from "../types"

interface IResultProps {
  roll: IRoll
}

export const Result = ({ roll }: IResultProps) => {
  const t = useTranslations("dice")
  const isD20 = roll.die.id === "d20"

  return (
    <span className="flex items-center gap-2.5">
      <span className="font-mono text-[13px] text-foreground-dim">
        {t("rolled", { value: roll.value })}
      </span>
      {isD20 && roll.value === 20 && (
        <span className="text-[13px] font-medium text-amber-400">
          {t("crit")}
        </span>
      )}
      {isD20 && roll.value === 1 && (
        <span className="text-[13px] font-medium text-accent">
          {t("fumble")}
        </span>
      )}
    </span>
  )
}

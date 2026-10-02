"use client"

import { useTranslations } from "next-intl"
import { IconDice } from "@/components/shared/icon"
import { useDie } from "../hooks/useDie"
import { useRoll } from "../hooks/useRoll"
import { useTarget } from "../hooks/useTarget"
import { DiceScene } from "./diceScene"
import { Result } from "./result"

export const DiceDemo = () => {
  const t = useTranslations("dice")
  const { roll, done, status, throwDie, finish } = useRoll()
  const { target, pick } = useTarget()
  const { die, dice, skin, skins, pickDie, pickSkin } = useDie()
  const values = Array.from({ length: die.sides }, (_, i) => die.sides - i)

  return (
    <div className="flex h-full flex-col bg-background font-sans">
      <div className="flex justify-end gap-4 p-4">
        <label className="flex items-center gap-2 text-[13px] text-muted">
          {t("die")}
          <select
            className="border border-border bg-panel px-2 py-1 text-foreground"
            value={die.id}
            onChange={(e) => pickDie(e.target.value)}
          >
            {dice.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-[13px] text-muted">
          {t("skin")}
          <select
            className="border border-border bg-panel px-2 py-1 text-foreground"
            value={skin.id}
            onChange={(e) => pickSkin(e.target.value)}
          >
            {skins.map((item) => (
              <option key={item.id} value={item.id}>
                {t(`skins.${item.id}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-[13px] text-muted">
          {t("target")}
          <select
            className="border border-border bg-panel px-2 py-1 text-foreground"
            value={target ?? ""}
            onChange={(e) => pick(e.target.value)}
          >
            <option value="">{t("random")}</option>
            {values.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-end px-6 pb-16">
        <p className="mb-5 text-[15px] leading-relaxed text-narration">
          {t("narration")}
        </p>

        <div className="flex items-center gap-2.5 border border-border bg-[#142014] px-3 py-2">
          <span className="text-system">
            <IconDice />
          </span>
          <span className="font-mono text-[13px] font-medium text-system">
            {t("skill")}
          </span>
          <span className="font-mono text-[13px] text-foreground-dim">
            {t("dc")}
          </span>

          <div className="relative">
            <div className="pointer-events-none absolute bottom-full left-1/2 h-[280px] w-[240px] -translate-x-1/2">
              <DiceScene roll={roll} skin={skin} done={done} onDone={finish} />
            </div>
            <button
              type="button"
              className="cursor-pointer border border-border bg-panel px-2.5 py-1 text-[13px] font-medium text-foreground hover:border-accent disabled:cursor-not-allowed disabled:opacity-60"
              disabled={status !== "throw"}
              onClick={() => throwDie(die, target)}
            >
              {t(status, { die: die.id })}
            </button>
          </div>

          {done && roll && <Result roll={roll} />}
        </div>
      </div>
    </div>
  )
}

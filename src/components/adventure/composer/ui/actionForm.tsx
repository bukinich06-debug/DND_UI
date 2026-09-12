"use client"

import type { KeyboardEvent, ReactNode } from "react"
import { useTranslations } from "next-intl"
import type { StructuredActionId } from "../types"
import type {
  IActionFormState,
  IComposerExit,
  IComposerItem,
  IComposerNpc,
  InspectKind,
  RestKind,
  SearchScope,
} from "../types"
import { ENV_NPC_ID, UNARMED_ID } from "../types"

const fieldClass =
  "w-full border border-border-light bg-panel px-3 py-2 font-sans text-sm text-foreground outline-none transition-colors focus:border-accent disabled:opacity-60"

const labelClass = "mb-1 block font-sans text-[13px] text-foreground-dim"

interface IActionFormProps {
  action: StructuredActionId
  form: IActionFormState
  onChange: (patch: Partial<IActionFormState>) => void
  npcs: IComposerNpc[]
  items: IComposerItem[]
  exits: IComposerExit[]
  exitsLoading: boolean
  sending: boolean
  onSubmit: () => void
}

export const ActionForm = ({
  action,
  form,
  onChange,
  npcs,
  items,
  exits,
  exitsLoading,
  sending,
  onSubmit,
}: IActionFormProps) => {
  const t = useTranslations("center.form")
  const weapons = items.filter((item) => item.kind === "weapon")

  const onKeyDown = (e: KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      (e.target as HTMLElement).tagName !== "TEXTAREA"
    ) {
      e.preventDefault()
      onSubmit()
    }
  }

  if (action === "talk")
    return (
      <div className="flex flex-1 flex-col gap-2" onKeyDown={onKeyDown}>
        <Field label={t("npc")}>
          <select
            className={fieldClass}
            value={form.npcId}
            disabled={sending}
            onChange={(e) => onChange({ npcId: e.target.value })}
          >
            <option value="">{t("pickNpc")}</option>
            {npcs.map((npc) => (
              <option key={npc.id} value={npc.id}>
                {npc.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("say")}>
          <textarea
            className={`${fieldClass} min-h-[72px] resize-none`}
            value={form.say}
            disabled={sending}
            placeholder={t("sayPlaceholder")}
            rows={2}
            onChange={(e) => onChange({ say: e.target.value })}
          />
        </Field>
        <Field label={t("doOptional")}>
          <input
            className={fieldClass}
            value={form.do}
            disabled={sending}
            placeholder={t("doPlaceholder")}
            onChange={(e) => onChange({ do: e.target.value })}
          />
        </Field>
      </div>
    )

  if (action === "inspect")
    return (
      <div className="flex flex-1 flex-col gap-2" onKeyDown={onKeyDown}>
        <Field label={t("inspectKind")}>
          <select
            className={fieldClass}
            value={form.inspectKind}
            disabled={sending}
            onChange={(e) =>
              onChange({ inspectKind: e.target.value as InspectKind })
            }
          >
            <option value="location">{t("kindLocation")}</option>
            <option value="npc">{t("kindNpc")}</option>
            <option value="item">{t("kindItem")}</option>
            <option value="other">{t("kindOther")}</option>
          </select>
        </Field>
        {form.inspectKind === "npc" && (
          <Field label={t("npc")}>
            <select
              className={fieldClass}
              value={form.npcId}
              disabled={sending}
              onChange={(e) => onChange({ npcId: e.target.value })}
            >
              <option value="">{t("pickNpc")}</option>
              {npcs.map((npc) => (
                <option key={npc.id} value={npc.id}>
                  {npc.name}
                </option>
              ))}
            </select>
          </Field>
        )}
        {form.inspectKind === "item" && (
          <Field label={t("item")}>
            <select
              className={fieldClass}
              value={form.itemId}
              disabled={sending}
              onChange={(e) => onChange({ itemId: e.target.value })}
            >
              <option value="">{t("pickItem")}</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
        )}
        {form.inspectKind === "other" && (
          <Field label={t("otherTarget")}>
            <input
              className={fieldClass}
              value={form.otherTarget}
              disabled={sending}
              placeholder={t("otherTargetPlaceholder")}
              onChange={(e) => onChange({ otherTarget: e.target.value })}
            />
          </Field>
        )}
        <Field label={t("focusOptional")}>
          <input
            className={fieldClass}
            value={form.focus}
            disabled={sending}
            placeholder={t("focusPlaceholder")}
            onChange={(e) => onChange({ focus: e.target.value })}
          />
        </Field>
      </div>
    )

  if (action === "search")
    return (
      <div className="flex flex-1 flex-col gap-2" onKeyDown={onKeyDown}>
        <Field label={t("searchScope")}>
          <select
            className={fieldClass}
            value={form.searchScope}
            disabled={sending}
            onChange={(e) =>
              onChange({ searchScope: e.target.value as SearchScope })
            }
          >
            <option value="location">{t("kindLocation")}</option>
            <option value="npc">{t("kindNpc")}</option>
          </select>
        </Field>
        {form.searchScope === "npc" && (
          <Field label={t("npc")}>
            <select
              className={fieldClass}
              value={form.npcId}
              disabled={sending}
              onChange={(e) => onChange({ npcId: e.target.value })}
            >
              <option value="">{t("pickNpc")}</option>
              {npcs.map((npc) => (
                <option key={npc.id} value={npc.id}>
                  {npc.name}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label={t("query")}>
          <input
            className={fieldClass}
            value={form.query}
            disabled={sending}
            placeholder={t("queryPlaceholder")}
            onChange={(e) => onChange({ query: e.target.value })}
          />
        </Field>
      </div>
    )

  if (action === "attack")
    return (
      <div className="flex flex-1 flex-col gap-2" onKeyDown={onKeyDown}>
        <Field label={t("target")}>
          <select
            className={fieldClass}
            value={form.npcId}
            disabled={sending}
            onChange={(e) => onChange({ npcId: e.target.value })}
          >
            <option value="">{t("pickNpc")}</option>
            {npcs.map((npc) => (
              <option key={npc.id} value={npc.id}>
                {npc.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("weapon")}>
          <select
            className={fieldClass}
            value={form.weaponId}
            disabled={sending}
            onChange={(e) => onChange({ weaponId: e.target.value })}
          >
            <option value={UNARMED_ID}>{t("unarmed")}</option>
            {weapons.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("mannerOptional")}>
          <input
            className={fieldClass}
            value={form.manner}
            disabled={sending}
            placeholder={t("mannerPlaceholder")}
            onChange={(e) => onChange({ manner: e.target.value })}
          />
        </Field>
      </div>
    )

  if (action === "move")
    return (
      <div className="flex flex-1 flex-col gap-2" onKeyDown={onKeyDown}>
        <Field label={t("exit")}>
          <select
            className={fieldClass}
            value={form.exitId}
            disabled={sending || exitsLoading || Boolean(form.localPath.trim())}
            onChange={(e) =>
              onChange({ exitId: e.target.value, localPath: "" })
            }
          >
            <option value="">
              {exitsLoading ? t("loadingExits") : t("pickExit")}
            </option>
            {exits.map((exit) => (
              <option key={exit.id} value={exit.id}>
                {exit.kind === "parent"
                  ? t("leaveTo", { name: exit.name })
                  : exit.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("localPath")}>
          <input
            className={fieldClass}
            value={form.localPath}
            disabled={sending || Boolean(form.exitId)}
            placeholder={t("localPathPlaceholder")}
            onChange={(e) =>
              onChange({ localPath: e.target.value, exitId: "" })
            }
          />
        </Field>
      </div>
    )

  if (action === "rest")
    return (
      <div className="flex flex-1 flex-col gap-2" onKeyDown={onKeyDown}>
        <Field label={t("restKind")}>
          <select
            className={fieldClass}
            value={form.restKind}
            disabled={sending}
            onChange={(e) => onChange({ restKind: e.target.value as RestKind })}
          >
            <option value="short">{t("restShort")}</option>
            <option value="long">{t("restLong")}</option>
            <option value="pause">{t("restPause")}</option>
          </select>
        </Field>
        <Field label={t("circumstancesOptional")}>
          <input
            className={fieldClass}
            value={form.circumstances}
            disabled={sending}
            placeholder={t("circumstancesPlaceholder")}
            onChange={(e) => onChange({ circumstances: e.target.value })}
          />
        </Field>
      </div>
    )

  return (
    <div className="flex flex-1 flex-col gap-2" onKeyDown={onKeyDown}>
      <Field label={t("stealthFrom")}>
        <select
          className={fieldClass}
          value={form.stealthNpcId}
          disabled={sending}
          onChange={(e) => onChange({ stealthNpcId: e.target.value })}
        >
          <option value={ENV_NPC_ID}>{t("environment")}</option>
          {npcs.map((npc) => (
            <option key={npc.id} value={npc.id}>
              {npc.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label={t("stealthAction")}>
        <input
          className={fieldClass}
          value={form.stealthAction}
          disabled={sending}
          placeholder={t("stealthActionPlaceholder")}
          onChange={(e) => onChange({ stealthAction: e.target.value })}
        />
      </Field>
    </div>
  )
}

interface IFieldProps {
  label: string
  children: ReactNode
}

const Field = ({ label, children }: IFieldProps) => (
  <label className="block">
    <span className={labelClass}>{label}</span>
    {children}
  </label>
)

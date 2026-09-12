"use client"

import { useTranslations } from "next-intl"
import { IconSend } from "@/components/shared/icon"
import { ActionChips } from "../../action-chips"
import { useComposer } from "../hooks/useComposer"
import { useComposerLists } from "../hooks/useComposerLists"
import { useDropStaleExit, useExits } from "../hooks/useExits"
import { ActionForm } from "./actionForm"

interface IComposerProps {
  onSend: (text: string) => Promise<void>
  sending: boolean
  error: string | null
  locationEpoch: number
}

export const Composer = ({
  onSend,
  sending,
  error,
  locationEpoch,
}: IComposerProps) => {
  const t = useTranslations("center")
  const { npcs, items, error: listsError } = useComposerLists({ locationEpoch })
  const {
    action,
    selectAction,
    input,
    setInput,
    form,
    patchForm,
    canSend,
    send,
    setForm,
  } = useComposer({
    onSend,
    sending,
    npcs,
    items,
  })
  const {
    exits,
    loading: exitsLoading,
    error: exitsError,
  } = useExits(action === "move", locationEpoch)
  useDropStaleExit(form.exitId, exits, exitsLoading, setForm)

  return (
    <div className="shrink-0 border-t border-border bg-background px-7 pt-4 pb-5">
      <ActionChips selected={action} onSelect={selectAction} />
      <div className="flex items-stretch gap-3">
        {action === "free" ? (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                void send(exits)
              }
            }}
            placeholder={t("placeholder")}
            rows={3}
            disabled={sending}
            className="flex-1 resize-none border border-border-light bg-panel px-3.5 py-3 font-sans text-base leading-normal text-foreground placeholder:text-muted outline-none transition-colors focus:border-accent disabled:opacity-60"
          />
        ) : (
          <ActionForm
            action={action}
            form={form}
            onChange={patchForm}
            npcs={npcs}
            items={items}
            exits={exits}
            exitsLoading={exitsLoading}
            sending={sending}
            onSubmit={() => void send(exits)}
          />
        )}
        <button
          type="button"
          onClick={() => void send(exits)}
          disabled={sending || !canSend}
          className="flex shrink-0 cursor-pointer items-center gap-2 self-stretch border-none bg-accent px-5 font-sans text-sm font-semibold text-white hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-60"
        >
          <IconSend />
          {t("execute")}
        </button>
      </div>
      {action === "free" && (
        <div className="mt-1.5 font-sans text-[13px] text-foreground-dim">
          {t("inputHint")}
        </div>
      )}
      {listsError && (
        <p className="mt-1.5 mb-0 font-sans text-xs text-combat">
          {listsError}
        </p>
      )}
      {exitsError && (
        <p className="mt-1.5 mb-0 font-sans text-xs text-combat">
          {exitsError}
        </p>
      )}
      {error && (
        <p className="mt-1.5 mb-0 font-sans text-xs text-combat">{error}</p>
      )}
    </div>
  )
}

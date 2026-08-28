"use client";

import { useTranslations } from "next-intl";
import { IconSend } from "@/components/shared/icon";
import { useComposer } from "../hooks/useComposer";
import { ActionChips } from "../../action-chips";

export const Composer = () => {
  const t = useTranslations("center");
  const { input, setInput, addSuggestion, send } = useComposer();

  return (
    <div className="shrink-0 border-t border-border bg-background px-7 pt-4 pb-5">
      <ActionChips onPick={addSuggestion} />
      <div className="flex items-end gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={t("placeholder")}
          rows={3}
          className="flex-1 resize-none rounded border border-border-light bg-panel px-3.5 py-3 font-serif text-[17px] leading-normal text-foreground placeholder:text-parchment-dim outline-none transition-colors focus:border-gold-dim"
        />
        <button
          type="button"
          onClick={send}
          className="flex h-20 shrink-0 cursor-pointer items-center gap-2 rounded border-none bg-gold px-5 font-sans text-sm font-semibold text-background hover:bg-parchment"
        >
          <IconSend />
          {t("execute")}
        </button>
      </div>
      <div className="mt-1.5 font-sans text-[13px] text-foreground-dim">{t("inputHint")}</div>
    </div>
  );
};

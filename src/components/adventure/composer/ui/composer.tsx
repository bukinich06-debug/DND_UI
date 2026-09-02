"use client";

import { useTranslations } from "next-intl";
import { IconSend } from "@/components/shared/icon";
import { ActionChips } from "../../action-chips";
import { useComposer } from "../hooks/useComposer";

interface IComposerProps {
  onSend: (text: string) => Promise<void>;
  sending: boolean;
  error: string | null;
}

export const Composer = ({ onSend, sending, error }: IComposerProps) => {
  const t = useTranslations("center");
  const { input, setInput, addSuggestion, send } = useComposer({ onSend, sending });

  return (
    <div className="shrink-0 border-t border-border bg-background px-7 pt-4 pb-5">
      <ActionChips onPick={addSuggestion} />
      <div className="flex items-stretch gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          placeholder={t("placeholder")}
          rows={3}
          disabled={sending}
          className="flex-1 resize-none border border-border-light bg-panel px-3.5 py-3 font-sans text-base leading-normal text-foreground placeholder:text-muted outline-none transition-colors focus:border-accent disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={sending}
          className="flex shrink-0 cursor-pointer items-center gap-2 self-stretch border-none bg-accent px-5 font-sans text-sm font-semibold text-white hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-60"
        >
          <IconSend />
          {t("execute")}
        </button>
      </div>
      <div className="mt-1.5 font-sans text-[13px] text-foreground-dim">{t("inputHint")}</div>
      {error && <p className="mt-1.5 mb-0 font-sans text-xs text-combat">{error}</p>}
    </div>
  );
};

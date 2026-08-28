import type { ILogMessage } from "@/components/shared/types";
import { IconDice, IconSword } from "@/components/shared/icon";
import { useTranslations } from "next-intl";

interface IMessageBubbleProps {
  msg: ILogMessage;
}

export const MessageBubble = ({ msg }: IMessageBubbleProps) => {
  const t = useTranslations("center");

  if (msg.type === "narration")
    return (
      <div className="pb-6">
        <p className="m-0 font-serif text-lg leading-[1.7] text-narration">{msg.text}</p>
        {msg.timestamp && <div className="mt-1.5 font-sans text-[13px] text-muted">— {msg.timestamp}</div>}
      </div>
    );

  if (msg.type === "npc")
    return (
      <div className="mb-5 border-l-2 border-gold-dim pl-3.5">
        <div className="mb-1 font-sans text-[13px] tracking-wide text-gold">{msg.speaker}</div>
        <p className="m-0 font-serif text-[17px] leading-[1.65] text-npc italic">&ldquo;{msg.text}&rdquo;</p>
      </div>
    );

  if (msg.type === "player")
    return (
      <div className="mb-5 rounded border border-border bg-panel px-3.5 py-3">
        <div className="mb-1.5 font-sans text-xs uppercase tracking-widest text-gold">{t("yourAction")}</div>
        <p className="m-0 font-serif text-base leading-[1.6] text-foreground">{msg.text}</p>
      </div>
    );

  if (msg.type === "system")
    return (
      <div className="mb-5 flex items-center gap-2.5 rounded border border-[#2e4038] bg-[#1a2420] px-3 py-2">
        <span className="text-system">
          <IconDice />
        </span>
        <div>
          <span className="font-mono text-[13px] font-medium text-system">{msg.text}</span>
          {msg.roll && <span className="ml-2.5 font-mono text-[13px] text-foreground-dim">{msg.roll}</span>}
          {msg.speaker && <span className="ml-2.5 font-sans text-[13px] font-medium text-hp">{msg.speaker}</span>}
        </div>
      </div>
    );

  if (msg.type === "combat")
    return (
      <div className="mb-5 rounded-r border-l-2 border-combat bg-[#1f1510] px-3.5 py-3">
        <div className="mb-1.5 flex items-center gap-1.5">
          <span className="text-combat">
            <IconSword />
          </span>
          <span className="font-sans text-[13px] font-medium uppercase tracking-wider text-combat">{msg.speaker}</span>
        </div>
        <p className="m-0 font-serif text-[17px] leading-[1.65] text-parchment">{msg.text}</p>
      </div>
    );

  return null;
};

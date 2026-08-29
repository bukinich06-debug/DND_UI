"use client";

import { useTranslations } from "next-intl";
import { MessageBubble } from "../message-bubble";
import { useLog } from "../hooks/useLog";
import { useLogScroll } from "../hooks/useLogScroll";

export const AdventureLog = () => {
  const t = useTranslations("center");
  const adventureLog = useLog();
  const logRef = useLogScroll(adventureLog.length);

  return (
    <div ref={logRef} className="scrollable flex-1 px-12 pt-8 pb-4">
      {adventureLog.map((msg) => (
        <MessageBubble key={msg.id} msg={msg} />
      ))}
      <div className="flex items-center gap-2 pb-2">
        <div className="size-1.5 bg-accent opacity-60" />
        <span className="font-sans text-[13px] text-muted italic">{t("thinking")}</span>
      </div>
    </div>
  );
};

"use client";

import { useTranslations } from "next-intl";
import { formatPurse } from "../helpers/formatPurse";
import { usePurse } from "../hooks/usePurse";

interface IPurseProps {
  className?: string;
}

export const Purse = ({ className }: IPurseProps) => {
  const t = useTranslations("coins");
  const purse = usePurse();
  const parts = formatPurse(purse);

  if (parts.length === 0) return null;

  return (
    <span className={className ?? "font-mono text-foreground-dim"}>
      {parts.map((part, i) => (
        <span key={part.unit}>
          {i > 0 && <span className="mx-1.5 inline-block text-border-light">·</span>}
          {part.amount} {t(part.unit)}
        </span>
      ))}
    </span>
  );
};

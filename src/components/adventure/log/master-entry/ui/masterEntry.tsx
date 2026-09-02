"use client";

import { useTranslations } from "next-intl";

export const MasterEntry = () => {
  const t = useTranslations("center");

  return (
    <div className="mb-5 font-sans text-[13px] text-muted italic">{t("masterStub")}</div>
  );
};

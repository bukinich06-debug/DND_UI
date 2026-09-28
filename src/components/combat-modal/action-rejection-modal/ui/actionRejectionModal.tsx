"use client"

import { useTranslations } from "next-intl"

interface IActionRejectionModalProps {
  reason: string
  onClose: () => void
}

export const ActionRejectionModal = ({ reason, onClose }: IActionRejectionModalProps) => {
  const t = useTranslations("combat.rejection")

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6 backdrop-blur-[4px]">
      <div className="w-full max-w-[500px] border border-border-light bg-panel shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
        <div className="border-b border-border px-5 py-4">
          <h2 className="m-0 font-sans text-[22px] font-bold uppercase text-foreground">
            {t("title")}
          </h2>
        </div>

        <div className="px-5 py-4">
          <p className="m-0 font-sans text-sm text-foreground leading-relaxed">
            {reason}
          </p>
        </div>

        <div className="flex justify-end border-t border-border px-5 py-4">
          <button
            onClick={onClose}
            className="cursor-pointer border border-accent bg-accent px-6 py-2 font-sans text-sm font-semibold text-background hover:opacity-90"
          >
            {t("understood")}
          </button>
        </div>
      </div>
    </div>
  )
}

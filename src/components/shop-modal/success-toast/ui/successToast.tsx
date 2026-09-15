import { useTranslations } from "next-intl"

interface ISuccessToastProps {
  itemName: string
}

export const SuccessToast = ({ itemName }: ISuccessToastProps) => {
  const t = useTranslations("shop")

  return (
    <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 animate-[fadeIn_0.2s_ease-in-out] border border-accent/30 bg-panel px-4 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
      <div className="font-sans text-sm text-accent">
        {t("boughtItem", { name: itemName })}
      </div>
    </div>
  )
}

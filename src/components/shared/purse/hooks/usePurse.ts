import { useMessages } from "next-intl";
import type { IContent, IPurse } from "@/components/shared/types";

export const usePurse = (): IPurse => {
  const messages = useMessages();
  return (messages.content as IContent).purse;
};

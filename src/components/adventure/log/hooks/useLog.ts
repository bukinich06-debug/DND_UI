import { useMessages } from "next-intl";
import type { IContent, ILogMessage } from "@/components/shared/types";

export const useLog = (): ILogMessage[] => {
  const messages = useMessages();
  return (messages.content as IContent).log;
};

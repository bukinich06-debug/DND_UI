import { useMessages } from "next-intl";
import type { IContent, INearbyEntry } from "@/components/shared/types";

export const useNearby = (): INearbyEntry[] => {
  const messages = useMessages();
  return (messages.content as IContent).nearby;
};

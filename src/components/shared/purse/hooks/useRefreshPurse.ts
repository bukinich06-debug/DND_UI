"use client";

import { usePurseContext } from "./usePurseState";

export const useRefreshPurse = (): (() => Promise<void>) => {
  const { refresh } = usePurseContext();
  return refresh;
};

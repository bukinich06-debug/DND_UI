"use client";

import { useEffect, useState } from "react";
import type { IPurse } from "@/components/shared/types";
import { getCoins } from "../api/getCoins";

export const usePurse = (): IPurse | null => {
  const [purse, setPurse] = useState<IPurse | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getCoins({ signal: controller.signal })
      .then(setPurse)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setPurse(null);
      });

    return () => controller.abort();
  }, []);

  return purse;
};

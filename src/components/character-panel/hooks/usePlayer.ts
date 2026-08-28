"use client";

import { useEffect, useState } from "react";
import { getPlayer } from "../api/getPlayer";
import type { IPlayer } from "../types";

export const usePlayer = (): IPlayer | null => {
  const [player, setPlayer] = useState<IPlayer | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getPlayer({ signal: controller.signal })
      .then(setPlayer)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setPlayer(null);
      });

    return () => controller.abort();
  }, []);

  return player;
};

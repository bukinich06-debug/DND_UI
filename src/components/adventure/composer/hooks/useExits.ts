import { useEffect, useState } from "react";
import { getExits } from "../api/getExits";
import type { IActionFormState, IComposerExit } from "../types";
import type { Dispatch, SetStateAction } from "react";

export const useExits = (active: boolean, locationEpoch: number) => {
  const [exits, setExits] = useState<IComposerExit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getExits({ signal: controller.signal })
      .then(setExits)
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setExits([]);
        setError(err instanceof Error ? err.message : "Не удалось загрузить выходы.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [active, locationEpoch]);

  return { exits, loading, error };
};

export const useDropStaleExit = (
  exitId: string,
  exits: IComposerExit[],
  loading: boolean,
  setForm: Dispatch<SetStateAction<IActionFormState>>,
) => {
  useEffect(() => {
    if (loading) return;
    if (exitId && !exits.some((exit) => exit.id === exitId))
      setForm((prev) => ({ ...prev, exitId: "" }));
  }, [exitId, exits, loading, setForm]);
};

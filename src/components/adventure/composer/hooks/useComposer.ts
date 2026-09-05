import { useState } from "react";
import type { ActionId } from "@/components/shared/types";
import { buildTurnText, canSendAction } from "../helpers/buildTurnText";
import {
  emptyForm,
  type IActionFormState,
  type IComposerExit,
  type IComposerItem,
  type IComposerNpc,
} from "../types";

interface IUseComposerParams {
  onSend: (text: string) => Promise<void>;
  sending: boolean;
  npcs: IComposerNpc[];
  items: IComposerItem[];
}

export const useComposer = ({ onSend, sending, npcs, items }: IUseComposerParams) => {
  const [action, setAction] = useState<ActionId>("free");
  const [input, setInput] = useState("");
  const [form, setForm] = useState<IActionFormState>(emptyForm);

  const selectAction = (id: ActionId) => {
    if (id === action) return;
    setAction(id);
    setForm(emptyForm());
  };

  const patchForm = (patch: Partial<IActionFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const canSend =
    action === "free" ? Boolean(input.trim()) : canSendAction(action, form);

  const send = async (exits: IComposerExit[]) => {
    if (!canSend || sending) return;
    const text =
      action === "free"
        ? input.trim()
        : buildTurnText({ action, form, npcs, items, exits });
    if (!text) return;
    try {
      await onSend(text);
      setInput("");
      setForm(emptyForm());
    } catch {
      /* keep input */
    }
  };

  return { action, selectAction, input, setInput, form, patchForm, canSend, send, setForm };
};

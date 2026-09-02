import { useState } from "react";

interface IUseComposerParams {
  onSend: (text: string) => Promise<void>;
  sending: boolean;
}

export const useComposer = ({ onSend, sending }: IUseComposerParams) => {
  const [input, setInput] = useState("");

  const addSuggestion = (label: string) => {
    setInput((prev) => (prev ? `${prev} ${label.toLowerCase()}` : label.toLowerCase()));
  };

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    try {
      await onSend(text);
      setInput("");
    } catch {
      /* keep input */
    }
  };

  return { input, setInput, addSuggestion, send };
};

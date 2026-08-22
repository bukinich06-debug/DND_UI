import { useState } from "react";

export const useComposer = () => {
  const [input, setInput] = useState("");

  const addSuggestion = (label: string) => {
    setInput((prev) => (prev ? `${prev} ${label.toLowerCase()}` : label.toLowerCase()));
  };

  const send = () => {
    if (!input.trim()) return;
    setInput("");
  };

  return { input, setInput, addSuggestion, send };
};

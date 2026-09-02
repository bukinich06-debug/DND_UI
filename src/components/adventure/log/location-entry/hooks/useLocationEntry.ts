import { useState } from "react";

export const useLocationEntry = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);
  return { open, toggle };
};

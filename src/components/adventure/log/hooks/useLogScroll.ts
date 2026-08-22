import { useEffect, useRef } from "react";

export const useLogScroll = (logLength: number) => {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logLength]);

  return logRef;
};

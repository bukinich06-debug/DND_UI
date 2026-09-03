import type { IPurse } from "@/components/shared/types";

const PP_CP = 1000;
const GP_CP = 100;
const EP_CP = 50;
const SP_CP = 10;

export const cpToPurse = (cp: number): IPurse => {
  let rest = Math.abs(cp);
  const pp = Math.floor(rest / PP_CP);
  rest %= PP_CP;
  const gp = Math.floor(rest / GP_CP);
  rest %= GP_CP;
  const ep = Math.floor(rest / EP_CP);
  rest %= EP_CP;
  const sp = Math.floor(rest / SP_CP);
  rest %= SP_CP;
  return { pp, gp, ep, sp, cp: rest };
};

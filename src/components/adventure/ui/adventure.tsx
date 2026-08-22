"use client";

import { AdventureHeader } from "../header";
import { AdventureLog } from "../log";
import { Composer } from "../composer";

export const Adventure = () => (
  <main className="flex min-w-0 flex-1 flex-col bg-background">
    <AdventureHeader />
    <AdventureLog />
    <Composer />
  </main>
);

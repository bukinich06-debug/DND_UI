interface INpc {
  id: string;
  name: string;
}

export interface INpcAtLocation {
  npc: INpc;
  role: string;
  isPrimary: boolean;
}

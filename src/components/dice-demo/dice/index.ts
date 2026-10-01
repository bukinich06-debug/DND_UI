import type { IDie } from "../types"
import { d10 } from "./d10"
import { d12 } from "./d12"
import { d20 } from "./d20"
import { d4 } from "./d4"
import { d6 } from "./d6"
import { d8 } from "./d8"

export const dice: IDie[] = [d4, d6, d8, d10, d12, d20]

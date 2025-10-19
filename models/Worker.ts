import type { Hashrates } from "./Hashrates";

export interface Worker extends Hashrates {
    workername: string
    lastshare: string
    shares: number
    bestshare: number
    bestever: number
}
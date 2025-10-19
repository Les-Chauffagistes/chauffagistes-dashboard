import type { Hashrates } from "./Hashrates";

export interface PoolHashrates extends Hashrates {
    hashrate15m: string
    hashrate6hr: string
}
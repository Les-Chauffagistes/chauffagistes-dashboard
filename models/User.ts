import type { Hashrates } from "./Hashrates";
import type { Worker } from "./Worker";

export interface User extends Hashrates {
    lastshare: number
    workers: number
    shares: number
    bestshare: number
    bestever: number
    authorized: number
    worker: Worker[]
}
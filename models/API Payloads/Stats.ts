import { Hashrates } from "../Hashrates"
import { Worker } from "../Worker"

// User in /api/stats/{btc_address}
export interface Stats {
    address: string
    globalStats: Hashrates & { shares: number, bestshare: number, bestever: number, workers: number }
    workers: Worker[]
}
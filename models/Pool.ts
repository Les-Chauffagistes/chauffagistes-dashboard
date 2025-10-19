import type { PoolHashrates } from "./PoolHashrate";
import type { PoolRuntime } from "./PoolRuntime";
import type { PoolShares } from "./PoolShares";

export interface Pool {
    runtime: PoolRuntime;
    hashrate: PoolHashrates;
    shares: PoolShares
}
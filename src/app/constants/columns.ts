export const HASHRATE_COLUMNS = ["hashrate1m", "hashrate5m", "hashrate1hr", "hashrate1d", "hashrate7d"] as const;
export const COMMUNITY_POOL_ADDRESS = "bc1qh8ge36h2njrp2aqv5ddpyph4g22elzgkds52ae";

export type HashrateColumn = typeof HASHRATE_COLUMNS[number];

export function isValidHashrateColumn(col: string): col is HashrateColumn {
  return HASHRATE_COLUMNS.includes(col as HashrateColumn);
}

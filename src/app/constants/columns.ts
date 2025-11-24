export const HASHRATE_COLUMNS = ["hashrate1m", "hashrate5m", "hashrate1hr", "hashrate1d", "hashrate7d"] as const;
export const COMMUNITY_POOL_ADDRESS = "bc1qqp9zq4an6nyzhcspz2xfmkcf8rj0p6w94a5gyeu2a7rghxjhnqqsvymz5m";

export type HashrateColumn = typeof HASHRATE_COLUMNS[number];

export function isValidHashrateColumn(col: string): col is HashrateColumn {
  return HASHRATE_COLUMNS.includes(col as HashrateColumn);
}

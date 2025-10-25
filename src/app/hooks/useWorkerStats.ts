import useSWR from "swr";
import { getWorkerStatsHistory } from "@/app/api";

export function useWorkerStats(workerName: string, period: "30d" | "forever" = "30d") {
  const { data, error, isLoading } = useSWR(
    ["workerStats", workerName, period],
    () => getWorkerStatsHistory(workerName, period),
    {
      revalidateOnFocus: false,
      refreshInterval: 60_000, // optionnel : refresh chaque minute
    }
  );

  return {
    stats: data ?? [],
    isLoading,
    isError: !!error,
  };
}
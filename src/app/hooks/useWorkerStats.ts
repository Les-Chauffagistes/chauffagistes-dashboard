import useSWR from "swr";
import { getWorkerStatsHistory } from "@/app/api";
import { WorkerHistoryRecord } from "../../../models/API Payloads/WorkerHistoryRecord";

export function useWorkerStats(userAddress: string, workerName: string, period: "30d" | "forever" = "30d"): {stats: WorkerHistoryRecord[], isLoading: boolean, isError: boolean} {
  const { data, error, isLoading } = useSWR(
    ["workerStats", userAddress, workerName, period],
    () => getWorkerStatsHistory(userAddress, workerName, period),
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
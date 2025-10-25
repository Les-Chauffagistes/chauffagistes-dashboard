// components/HashrateCell.tsx
import { HashrateSparkline } from "../components/HashrateSparkline";
import { CircularProgress } from "@mui/material";
import UnitConverter from "@/../lib/UnitConverter";
import { useWorkerStats } from "@/app/hooks/useWorkerStats";
import { HistoryRecord } from "../../../../../../models/HistoryRecord";

type Props = {
  workerName: string;
  value: number | null;
  period: "30d" | "forever";
  hashrateKey: "hashrate1m" | "hashrate5m" | "hashrate1h" | "hashrate1d" | "hashrate7d";
};

export function HashrateCell({ workerName, value, period, hashrateKey }: Props) {
  const { stats, isLoading } = useWorkerStats(workerName, period);

  // Extraire seulement les valeurs pertinentes pour cette colonne
  const points =
    stats?.map((s: HistoryRecord) => ({
      timestamp: s.timestamp,
      value: s[`avg_${hashrateKey}`],
    })) ?? [];

  return (
    <div style={{display: "flex", gap: 5, justifyContent: "space-between"}}>
      <div className="">
        {value ? UnitConverter.fromNumberToString(value) : "-"}
      </div>
      <div className="" id="sparkline" style={{maxWidth: "50%", width: "100%"}}>
        {isLoading ? (
          <CircularProgress size={14} />
        ) : (
          <HashrateSparkline stats={points} />
        )}
      </div>
    </div>
  );
}
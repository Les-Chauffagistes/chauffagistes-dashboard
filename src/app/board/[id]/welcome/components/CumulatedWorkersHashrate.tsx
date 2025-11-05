import { AllWorkersHistoryRecord } from "../../../../../../models/API Payloads/AllWorkersHistoryRecord";
import { LineChart, lineElementClasses, LineSeries } from '@mui/x-charts/LineChart';
import Box from '@mui/material/Box';
import { AxisValueFormatterContext } from "@mui/x-charts";
import * as React from "react";
import UnitConverter from "../../../../../../lib/UnitConverter";
import { SeriesValueFormatter } from "@mui/x-charts/internals";

export default function CumulateHdWorkersHashrate({
  workersHistory,
}: {
  workersHistory: Readonly<
    AllWorkersHistoryRecord[]
  >;
}) {
  // 1. Grouper les enregistrements par worker
  const grouped = new Map<string, { [timestamp: string]: number }>();
  const allTimestamps = new Set<string>();

  for (const record of workersHistory) {
    const workerKey = record.worker_id; // 🔸 différencie les users
    if (!grouped.has(workerKey)) grouped.set(workerKey, {});
    grouped.get(workerKey)![record.bucket] = Number(record.avg_hashrate1h);
    allTimestamps.add(record.bucket);
  }

  // 2. Créer une timeline commune triée
  const sortedTimestamps = Array.from(allTimestamps)
    .map((t) => new Date(t))
    .sort((a, b) => a.getTime() - b.getTime());

  // 3. Construire les séries alignées
  const series: LineSeries[] = [];
  for (const [workerKey, records] of grouped) {
    const data = sortedTimestamps.map(
      (t) => records[t.toISOString()] ?? null // ou null si tu veux une discontinuité visible
    );

    series.push({
      label: workerKey,
      data,
      area: true,
      stack: "total",
      showMark: false,
      valueFormatter: (value: number | null) => {
        if (value === null) return "";
        return UnitConverter.fromNumberToString(value, 3);
      }
    });
  }

  return (
    <Box sx={{ width: "100%", height: 900 }}>
      <LineChart
        series={series}
        xAxis={[
          {
            scaleType: "point",
            data: sortedTimestamps,
            valueFormatter: (value: Date, context) =>
              context?.location === "tick"
                ? value.toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                  })
                : value.toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
          },
        ]}
        yAxis={[{ width: 50,
            valueFormatter: (value: number, context: AxisValueFormatterContext) => {
              if (context.location === "tick" && context.defaultTickLabel === "") return "";
              return UnitConverter.fromNumberToString(value, 3);
            }
         }]}
        sx={{
          [`& .${lineElementClasses.root}`]: {
            display: "none",
          },
        }}
        hideLegend
      />
    </Box>
  );
}
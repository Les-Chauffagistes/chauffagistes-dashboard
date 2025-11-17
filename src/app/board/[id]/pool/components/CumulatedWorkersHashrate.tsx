import { AllWorkersHistoryRecord } from "../../../../../../models/API Payloads/AllWorkersHistoryRecord";
import { LineChart, lineElementClasses, LineSeries } from '@mui/x-charts/LineChart';
import { YAxis } from "@mui/x-charts";
import * as React from "react";
import UnitConverter from "../../../../../../lib/UnitConverter";
import ColorSpectrum from "../../../../../../lib/ColorSpectrum";

export default function CumulateHdWorkersLine({
    workersHistory,
    statName = "avg_hashrate1h",
    yAxis
}: {
    workersHistory: Readonly<
        AllWorkersHistoryRecord[]
    >;
    statName: keyof Omit<AllWorkersHistoryRecord, "worker_id" | "bucket">;
    yAxis: YAxis[]
}) {
    // 1. Grouper les enregistrements par worker
    const grouped = new Map<string, { [timestamp: string]: number }>();
    const allTimestamps = new Set<string>();

    for (const record of workersHistory) {
        const workerKey = record.worker_id; // 🔸 différencie les users
        if (!grouped.has(workerKey)) grouped.set(workerKey, {});
        grouped.get(workerKey)![record.bucket] = Number(record[statName]);
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

    const colors = ColorSpectrum.lchStepRange(series.length, 100, 10,  50, 90);

    return (
        <LineChart
            series={series}
            height={500}
            colors={colors}
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
            yAxis={yAxis}
            sx={{
                [`& .${lineElementClasses.root}`]: {
                    display: "none",
                },
            }}
            hideLegend
        />
    );
}
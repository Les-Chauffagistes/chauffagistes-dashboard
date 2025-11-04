import { AxisValueFormatterContext, LineChart } from "@mui/x-charts";
import { WorkerHistoryRecord } from "../../../../../../models/API Payloads/WorkerHistoryRecord";
import UnitConverter from "../../../../../../lib/UnitConverter";
import { frFRLocalText } from '@mui/x-charts/locales';

export default function HashreateLine({ history }: { history: WorkerHistoryRecord[] }) {
    return (
        <LineChart
            localeText={frFRLocalText}
            height={400}
            yAxis={[
                {
                    id: 'hashrateAxis',
                    width: 70,
                    label: "Hashrate (H/s)",
                    valueFormatter(value: number, context: AxisValueFormatterContext) {
                        if (context.location === "tick" && context.defaultTickLabel === "") return "";
                        return UnitConverter.fromNumberToString(value, 3);
                    }
                },
                {
                    id: 'weightAxis',
                    position: "right",
                    width: 70,
                    label: "Poids (%)",
                    valueFormatter(value: number, context: AxisValueFormatterContext) {
                        if (context.location === "tick" && context.defaultTickLabel === "") return "";
                        return value + "%";
                    }
                },
            ]}
            xAxis={[
                {
                    data: history.map((item) => new Date(item.timestamp)),
                    scaleType: "time",
                    label: "Date",
                    valueFormatter: (value: Date, context: AxisValueFormatterContext) =>
                        context?.location === "tick"
                            ? (value as Date).toLocaleDateString("fr-FR", {
                                day: "2-digit",
                                month: "2-digit",
                            })
                            : (value as Date).toLocaleString("fr-FR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                }
            ]}
            series={[
                {
                    data: history.map((item) => item.avg_hashrate1h),
                    showMark: false,
                    yAxisId: 'hashrateAxis',
                    label: "Hashrate (1h)",
                    valueFormatter: (v: number | null) => {
                        if (!v) return "0";
                        return UnitConverter.fromNumberToString(v);
                    },
                },
                {
                    data: history.map((item) => item.avg_hashrate1d),
                    showMark: false,
                    yAxisId: 'hashrateAxis',
                    label: "Hashrate (1d)",
                    valueFormatter: (v: number | null) => {
                        if (!v) return "0";
                        return UnitConverter.fromNumberToString(v);
                    },
                },
                {
                    data: history.map((item) => item.avg_hashrate7d),
                    showMark: false,
                    yAxisId: 'hashrateAxis',
                    label: "Hashrate (7d)",
                    valueFormatter: (v: number | null) => {
                        if (!v) return "0";
                        return UnitConverter.fromNumberToString(v);
                    },
                },
                {
                    data: history.map((item) => Number.parseFloat(item.avg_weight)),
                    showMark: false,
                    yAxisId: 'weightAxis',
                    label: "Poids",
                    valueFormatter: (v: number | null) => {
                        if (!v) return "0%";
                        return v.toFixed(1) + "%";
                    },
                },
            ]}
        />
    )
}
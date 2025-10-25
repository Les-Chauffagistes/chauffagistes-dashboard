import { SparkLineChart, SparkLineChartProps } from '@mui/x-charts';
import { areaElementClasses, lineElementClasses } from '@mui/x-charts/LineChart';
import { chartsAxisHighlightClasses } from '@mui/x-charts/ChartsAxisHighlight';

export function HashrateSparkline({ stats }: { stats: { timestamp: string, value: number }[] }) {
    const parsed = stats.map((item) => ({
        x: new Date(item.timestamp), // 🔥 conversion ici
        y: item.value ?? 0,
    }));

    const settings: SparkLineChartProps = {
        data: stats.map((item) => item.value),
        baseline: 'min',
        margin: { bottom: 0, top: 5, left: 4, right: 0 },
        xAxis: {
            id: 'week-axis',
            data: parsed.map((item) => item.x),
            scaleType: 'time',
        },
        yAxis: {
            domainLimit: () => {
                if (stats.length === 0) return { min: 0, max: 1 };
                const values = stats.map(s => s.value ?? 0);
                const min = Math.min(...values);
                const max = Math.max(...values);
                const padding = (max - min) * 0.1;
                return {
                    min: min - padding,
                    max: max + padding,
                };
            },
        },
        sx: {
            [`& .${areaElementClasses.root}`]: { opacity: 0.2 },
            [`& .${lineElementClasses.root}`]: { strokeWidth: 1 },
            [`& .${chartsAxisHighlightClasses.root}`]: {
                stroke: 'var(--orange)',
                strokeDasharray: 'none',
                strokeWidth: 1,
            },
        },
        slotProps: {
            lineHighlight: { r: 2 }, // Reduce the radius of the axis highlight.
        },
        clipAreaOffset: { top: 2, bottom: 2 },
        axisHighlight: { x: 'line' },
    };
    return <SparkLineChart
        height={40}
        area
        showHighlight
        color="var(--orange)"
        {...settings}
    />
}
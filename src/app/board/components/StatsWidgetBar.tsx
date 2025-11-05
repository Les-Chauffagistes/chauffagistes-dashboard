import { LucideIcon } from "lucide-react";

import WidgetCard from "../components/WidgetCard";

export default function StatsWidgetBar({ data }: Readonly<{ data: { title: string, value: number | string, icon: LucideIcon }[] }>) {
    return (
        <div style={{
            display: "flex",

            gap: 10
        }}>
            {data.map((item) => {
                return (
                    <WidgetCard key={item.title} title={item.title} value={item.value} Icon={item.icon} />
                )
            })}
        </div>
    )
}
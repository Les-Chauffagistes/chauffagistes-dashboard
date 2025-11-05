import { LucideIcon } from "lucide-react";
import UnitConverter from "../../../../../../lib/UnitConverter";
import WidgetCard from "../../../components/WidgetCard";

export default function StatsWidgetBar({ data }: Readonly<{ data: { title: string, value: number | string, icon: LucideIcon }[] }>) {
    return (
        <div style={{
            display: "flex",
            margin: "20px 10px",
            gap: 10
        }}>
            {data.map((item) => {
                if (typeof item.value === "string") {
                    item.value = UnitConverter.fromStringToNumber(item.value);
                }
                item.value = UnitConverter.fromNumberToString(item.value);
                return (
                    <WidgetCard key={item.title} title={item.title} value={item.value} Icon={item.icon} />
                )
            })}
        </div>
    )
}
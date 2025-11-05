import { LucideIcon } from "lucide-react";
import { Jua } from "next/font/google";


const jua = Jua({
    variable: "--font-jua",
    subsets: ["latin"],
    weight: "400",
});

export default function WidgetCard({ title, value, Icon }: Readonly<{ title: string, value: number | string, Icon: LucideIcon }>) {
    return (
        <div style={{
            border: "1px solid var(--card-outline-color)",
            backgroundColor: "var(--card-background-color)",
            borderRadius: "10px",
            padding: "5px 10px",
            width: 140,
            fontSmooth: "antialiased",
            WebkitFontSmoothing: "antialiased",
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 5
            }}>
                <Icon size={16} color="var(--secondary-white-text-color)" />
                <h5 style={{
                    textTransform: "uppercase",
                    color: "var(--secondary-white-text-color)",
                    fontWeight: 200,
                    margin: "5px 0"
                }}>{title}</h5>
            </div>
            <h2 style={{
                margin: "5px 0 0",
                fontWeight: 800,
                fontSize: "1.6rem"
            }} className={jua.className}>{value}</h2>
        </div>
    )
}
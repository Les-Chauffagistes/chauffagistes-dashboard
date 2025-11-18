import { LucideIcon } from "lucide-react";
import "./combinedWidgetCard.css";
import { Jua } from "next/font/google";

const heavyRoundedFont = Jua({
    variable: "--font-jua",
    subsets: ["latin"],
    weight: "400",
});

export default function CombinedWidgetCard({ data }: { data: { title: string, values: { label: string, value: number | string }[], icon: LucideIcon } }) {
    return (
        <>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                width: "100%",
                marginBottom: -5,
            }}>
                <data.icon size={16} color="var(--secondary-white-text-color)" />
                <h5 style={{
                    textTransform: "uppercase",
                    color: "var(--secondary-white-text-color)",
                    fontWeight: 200,
                    margin: "5px 0"
                }}>{data.title}</h5>
            </div>
            <div id="hashrates-bar" style={{
                fontSmooth: "antialiased",
                WebkitFontSmoothing: "antialiased",
                border: "1px solid var(--card-outline-color)",
                borderRadius: "10px",
                backgroundColor: "var(--card-outline-color)",
                gap: 1,
                overflow: "hidden",
                width: "fit-content",
                maxWidth: "100%",
                display: "flex",
                inlineSize: "fit-content",
                flexWrap: "wrap",
            }}>
                {data.values.map((item) => {
                    return (
                        <div
                            className="combined-widget-card-item"
                            key={item.label}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                                flexDirection: "column",
                                padding: 10,
                                flex: 1,
                                minWidth: 140,
                                backgroundColor: "var(--background)",
                            }}
                        >
                            <h4
                                className={heavyRoundedFont.className}
                                style={{
                                    textTransform: "uppercase",
                                    fontSize: "1.6rem",
                                    fontWeight: 800,
                                    margin: 0,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {item.value}
                            </h4>
                            <h5
                                style={{
                                    color: "var(--secondary-white-text-color)",
                                    fontWeight: 200,
                                    margin: 0,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {item.label}
                            </h5>
                        </div>
                    );
                })}
            </div>
        </ >
    )
}
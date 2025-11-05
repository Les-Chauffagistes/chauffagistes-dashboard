"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PoolHistoryRecord } from "../../../../../models/API Payloads/PoolHistoryRecord";
import { getPoolHistory, getPoolStats, getPoolWeight } from "@/app/api";
import HashrateChart from "./components/HashrateChart";
import RepartitionPie from "./components/RepartitionPie";
import { Weights } from "../../../../../models/API Payloads/Weights";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { UserInstantStats } from "../../../../../models/API Payloads/Stats";
import StatsWidgetBar from "./components/StatsWidgetBar";

export default function Welcome() {
    const path = usePathname();
    const userId = path?.split("/")[2];

    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const theme = useMemo(() => createTheme({ palette: { mode: prefersDarkMode ? "dark" : "light" }}), [prefersDarkMode]);

    const [poolStatsHistory, setPoolStatsHistory] = useState<PoolHistoryRecord[] | null>(null);
    const [poolStats, setPoolStats] = useState<UserInstantStats | null>(null);
    const [weights, setWeights] = useState<Weights[]>([]);

    useEffect(() => {
        getPoolHistory(userId).then((data) => {
            setPoolStatsHistory(data);
        });
        getPoolWeight(userId).then((data) => {
            setWeights(data);
        })
        getPoolStats(userId).then((data) => {
            setPoolStats(data);
        })
    }, [userId]);

    if (poolStatsHistory === null) {
        return <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>Préchauffage...</div>;
    }

    return (
        <ThemeProvider theme={theme}>
            {poolStats ? <StatsWidgetBar data={[]} /> : null}
            <div style={{overflow: "hidden", display: "flex", marginTop: 10, height:"100%"}}>
                <div style={{display: "flex", justifyContent: "start", width: "fit-content", height: "fit-content"}}>
                    <RepartitionPie weights={weights} />
                </div>
                <div style={{width: "100%"}}>
                    <HashrateChart data={poolStatsHistory} />
                </div>
            </div>
        </ThemeProvider>
    )
}
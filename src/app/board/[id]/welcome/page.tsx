"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PoolHistoryRecord } from "../../../../../models/API Payloads/PoolHistoryRecord";
import { getPoolHistory, getPoolWeight } from "@/app/api";
import HashrateChart from "./components/HashrateChart";
import RepartitionPie from "./components/RepartitionPie";
import { Weights } from "../../../../../models/API Payloads/Weights";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

export default function Welcome() {
    const path = usePathname();
    const userId = path?.split("/")[2];

    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const theme = useMemo(() => createTheme({ palette: { mode: prefersDarkMode ? "dark" : "light" }}), [prefersDarkMode]);

    const [poolStatsHistory, setPoolStatsHistory] = useState<PoolHistoryRecord[] | null>(null);
    const [weights, setWeights] = useState<Weights[]>([]);

    useEffect(() => {
        getPoolHistory(userId).then((data) => {
            setPoolStatsHistory(data);
        });

    }, [userId]);

    useEffect(() => {
        getPoolWeight(userId).then((data) => {
            setWeights(data);
        })
    }, [userId]);

    if (poolStatsHistory === null) {
        return <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>Préchauffage...</div>;
    }

    return (
        <ThemeProvider theme={theme}>
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
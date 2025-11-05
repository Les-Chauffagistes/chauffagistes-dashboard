"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PoolHistoryRecord } from "../../../../../models/API Payloads/PoolHistoryRecord";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { CircleStar, Flame, SatelliteDish } from "lucide-react";
import { getAllWorkersHistory, getPoolHistory, getPoolStats, getPoolWeight } from "@/app/api";

import RepartitionPie from "./components/RepartitionPie";
import HashrateChart from "./components/HashrateChart";
import CombinedWidgetCard from "./components/CombinedWidgetCard";

import { Weights } from "../../../../../models/API Payloads/Weights";
import { UserInstantStats } from "../../../../../models/API Payloads/Stats";
import { AllWorkersHistoryRecord } from "../../../../../models/API Payloads/AllWorkersHistoryRecord";

import StatsWidgetBar from "../../components/StatsWidgetBar";

import UnitConverter from "../../../../../lib/UnitConverter";

import "./styles.css";


export default function Welcome() {
    const path = usePathname();
    const userId = path?.split("/")[2];

    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const theme = useMemo(() => createTheme({ palette: { mode: prefersDarkMode ? "dark" : "light" } }), [prefersDarkMode]);

    const [poolStatsHistory, setPoolStatsHistory] = useState<PoolHistoryRecord[] | null>(null);
    const [poolStats, setPoolStats] = useState<UserInstantStats | null>(null);
    const [weights, setWeights] = useState<Weights[]>([]);
    const [workersHistory, setWorkersHistory] = useState<AllWorkersHistoryRecord[] | null>(null);

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
        getAllWorkersHistory(userId).then((data) => {
            setWorkersHistory(data);
        })
    }, [userId]);

    if (poolStatsHistory === null || poolStats === null || weights === null || workersHistory == null) {
        return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>Préchauffage...</div>;
    }


    return (
        <ThemeProvider theme={theme}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                overflow: "scroll",
                height: "100%",
                gap: 10
            }}>
                {poolStats ?
                    <div style={{
                        margin: "20px 10px",
                        display: "flex",
                        alignItems: "end",
                        gap: 10,
                    }}>
                        <CombinedWidgetCard data={{
                            title: "Hashrate",
                            values: [
                                {
                                    label: "1m",
                                    value: UnitConverter.fromNumberToString(UnitConverter.fromStringToNumber(poolStats.globalStats.hashrate1m)) + "H/s"
                                },
                                {
                                    label: "1h",
                                    value: UnitConverter.fromNumberToString(UnitConverter.fromStringToNumber(poolStats.globalStats.hashrate1hr)) + "H/s"
                                },
                                {
                                    label: "1d",
                                    value: UnitConverter.fromNumberToString(UnitConverter.fromStringToNumber(poolStats.globalStats.hashrate1d)) + "H/s"
                                },
                                {
                                    label: "7d",
                                    value: UnitConverter.fromNumberToString(UnitConverter.fromStringToNumber(poolStats.globalStats.hashrate7d)) + "H/s"
                                },
                            ],
                            icon: Flame
                        }} />
                        <StatsWidgetBar data={[
                            {
                                title: "Shares",
                                value: UnitConverter.fromNumberToString(poolStats.globalStats.shares),
                                icon: SatelliteDish
                            },
                            {
                                title: "Best Share",
                                value: UnitConverter.fromNumberToString(poolStats.globalStats.bestshare),
                                icon: CircleStar
                            },
                        ]} />
                    </div> : null
                }
                <div style={{ display: "flex", marginTop: 10, height: 400, gap: 10, margin: "0 10px" }}>
                    <div className="graph" style={{ display: "flex", justifyContent: "start", width: "fit-content" }}>
                        <RepartitionPie weights={weights} />
                    </div>
                    <div className="graph" style={{ width: "100%" }}>
                        <HashrateChart data={poolStatsHistory} />
                    </div>
                </div>
                <div style={{
                    height: 400
                }}>
                    {/* <CumulatedWorkersHashrate workersHistory={workersHistory} /> */}
                </div>
            </div>
        </ThemeProvider>
    )
}
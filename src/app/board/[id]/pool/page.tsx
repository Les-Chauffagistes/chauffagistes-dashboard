"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PoolHistoryRecord } from "../../../../../models/API Payloads/PoolHistoryRecord";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { CircleStar, Flame, SatelliteDish } from "lucide-react";
import { getAllWorkersHistory, getPoolHistory, getPoolStats, getPoolWeight } from "@/app/api";

import HashrateChart from "./components/HashrateChart";
import CombinedWidgetCard from "./components/CombinedWidgetCard";

import { Weights } from "../../../../../models/API Payloads/Weights";
import { UserInstantStats } from "../../../../../models/API Payloads/Stats";
import { AllWorkersHistoryRecord } from "../../../../../models/API Payloads/AllWorkersHistoryRecord";

import StatsWidgetBar from "../../components/StatsWidgetBar";

import UnitConverter from "../../../../../lib/UnitConverter";

import "./styles.css";
import CumulatedWorkersLine from "./components/CumulatedWorkersHashrate";
import StackedStatSelecteor, { OptionsType } from "./components/StackedStatSelector";
import { AxisValueFormatterContext, YAxis } from "@mui/x-charts";
import * as React from "react";
import ResponsivePieContainer from "./components/ResponsivePieContainer";



export default function Welcome() {
    const path = usePathname();
    const userId = path?.split("/")[2];

    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const theme = useMemo(() => createTheme({ palette: { mode: prefersDarkMode ? "dark" : "light" } }), [prefersDarkMode]);

    const [poolStatsHistory, setPoolStatsHistory] = useState<PoolHistoryRecord[] | null>(null);
    const [poolStats, setPoolStats] = useState<UserInstantStats | null>(null);
    const [weights, setWeights] = useState<Weights[]>([]);
    const [workersHistory, setWorkersHistory] = useState<AllWorkersHistoryRecord[] | null>(null);
    const [stackedStatName, setStackedStatName] = useState<keyof Omit<AllWorkersHistoryRecord, "worker_id" | "bucket">>("avg_hashrate1h");

    const isLargeScreen = useMediaQuery("(min-width: 800px)");


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

    const statsNames: OptionsType<keyof Omit<AllWorkersHistoryRecord, "worker_id" | "bucket">> = [
        {
            "displayName": "Hashrate",
            "optionName": "avg_hashrate1h"
        },
        {
            "displayName": "Poids",
            "optionName": "avg_weight"
        }
    ]

    function handleStackedStatChange(statName: keyof Omit<AllWorkersHistoryRecord, "worker_id" | "bucket">) {
        setStackedStatName(statName);
    }
    let yAxis: YAxis[]
    if (stackedStatName == "avg_hashrate1h") {
        yAxis = [{
            width: 75,
            label: "Hashrate (H/s)",
            valueFormatter: (value: number, context: AxisValueFormatterContext) => {
                if (context.location === "tick" && context.defaultTickLabel === "") return "";
                return UnitConverter.fromNumberToString(value, 3);
            }
        }]

    } else {
        yAxis = [{
            width: 75,
            label: "Poids (%)",
            max: 100,
            valueFormatter: (value: number, context: AxisValueFormatterContext) => {
                if (context.location === "tick" && context.defaultTickLabel === "") return "";
                return value.toFixed(0) + "%";
            }
        }]

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
                        maxWidth: "100%",
                        flexWrap: "wrap",
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
                {isLargeScreen ?
                    <div style={{ display: "flex", marginTop: 10, height: 400, gap: 10, margin: "0 10px" }}>
                        <div className="graph" style={{ width: "100%", margin: "0 10px", flex: 1 }}>
                            <ResponsivePieContainer weights={weights} />
                        </div>
                        <div className="graph" style={{ width: "100%", flex: 3 }}>
                            <HashrateChart data={poolStatsHistory} />
                        </div>
                    </div>
                    :
                    <div className="graph" style={{ width: "calc(100% - 20px)", margin: "0 10px 10px", flex: 1 }}>
                        <ResponsivePieContainer weights={weights} />
                    </div>
                }
                {isLargeScreen ? 
                    <div className="graph" style={{
                        margin: "0 10px 10px",
                        width: "calc(100% - 20px)", // -marges
                    }}>
                        <div style={{
                            margin: '10px auto',
                        }}>
                            <StackedStatSelecteor options={statsNames} handler={handleStackedStatChange} />
                        </div>
                        <CumulatedWorkersLine workersHistory={workersHistory} statName={stackedStatName} yAxis={yAxis} />
                    </div>
                : null
                }
            </div>
        </ThemeProvider>
    )
}
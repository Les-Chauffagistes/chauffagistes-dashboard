"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { Computer, User } from "lucide-react";

import { getBtcBlockReward, getBtcPrice, getPoolWeight, getPoolStats } from "@/app/api";

import StatsWidgetBar from "../../components/StatsWidgetBar";
import { MainGrid } from "./components/Table";
import { Toolbar } from "./components/Toolbar"
import WorkerPannel from "./components/WorkerPannel";
import WorkerList from "./components/WorkerList";


import UnitConverter from "@/../lib/UnitConverter";
import ExtractWorkername from "@/../lib/ExtractWorkername";

import { UserInstantStats } from "@/../models/API Payloads/Stats";
import { CleanWorkerHashrate } from "@/../models/CleanWorkerHashrate";
import { Weights } from "@/../models/API Payloads/Weights";
import { Worker } from "@/../models/Worker";

import "./styles.css";

const COMMUNITY_POOL_ADDRESS = "bc1qh8ge36h2njrp2aqv5ddpyph4g22elzgkds52ae";

export default function Home() {
    const [userStats, setUserStats] = useState<UserInstantStats | null>(null); // table
    const [weights, setWeights] = useState<Weights[]>([]);
    const [hashrate1m, setHashrate1m] = useState<boolean>(true);
    const [hashrate5m, setHashrate5m] = useState<boolean>(true);
    const [hashrate1hr, setHashrate1hr] = useState<boolean>(true);
    const [hashrate1d, setHashrate1d] = useState<boolean>(true);
    const [hashrate7d, setHashrate7d] = useState<boolean>(true);
    const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
    const [bitcoinPrice, setBitcoinPrice] = useState<number | null>(null);
    const [bitcoinBlockReward, setBitcoinBlockReward] = useState<number | null>(null);
    const [orderBy, setOrderBy] = useState<keyof CleanWorkerHashrate>("weight");
    const pathname = usePathname();
    const userAddress = pathname?.split("/")[2];
    const isCommunityPool = userAddress === COMMUNITY_POOL_ADDRESS;

    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const theme = useMemo(() => createTheme({ palette: { mode: prefersDarkMode ? "dark" : "light" } }), [prefersDarkMode]);

    // Persist mutable active columns across renders
    const activeColumnsRef = useRef<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("activeColumns");
        if (stored) {
            const arr = JSON.parse(stored);
            activeColumnsRef.current = arr;
            setHashrate1m(arr.includes("hashrate1m"));
            setHashrate5m(arr.includes("hashrate5m"));
            setHashrate1hr(arr.includes("hashrate1hr"));
            setHashrate1d(arr.includes("hashrate1d"));
            setHashrate7d(arr.includes("hashrate7d"));
        } else {
            const defaults = ["hashrate1m", "hashrate5m", "hashrate1hr", "hashrate1d", "hashrate7d"];
            localStorage.setItem("activeColumns", JSON.stringify(defaults));
            activeColumnsRef.current = defaults;
            setHashrate1m(true);
            setHashrate5m(true);
            setHashrate1hr(true);
            setHashrate1d(true);
            setHashrate7d(true);
        }
        // Fetch des stats instantannées
        getPoolStats(userAddress).then((result) => {
            setUserStats(result);
        });
        // Fetch des poids dans la bdd du History Server
        getPoolWeight(userAddress).then((result) => {
            setWeights(result);
        })
        // Fetch du prix de Bitcoin
        getBtcPrice().then((result) => {
            setBitcoinPrice(result.EUR);
        })
        // Fetch de la reward du block Bitcoin
        getBtcBlockReward().then((result) => {
            setBitcoinBlockReward(result);
        })
    }, [userAddress]);

    const isLargeScreen = useMediaQuery("(min-width: 800px)");

    if (isCommunityPool && (bitcoinPrice === null && bitcoinBlockReward === null)) {
        return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>Préchauffage...</div>;
    }

    if (!userStats || !weights.length) {
        return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>Préchauffage...</div>;
    }

    const payload = { ...userStats.workers } as (Worker & { weight: number })[];

    for (const [, worker] of Object.entries(payload)) {
        const workerName = ExtractWorkername.fromPool(worker.workername);
        worker.weight = Number.parseFloat(weights.find(w => w.worker_id === workerName)?.avg_weight || "0");
    }

    function persistActiveColumns() {
        localStorage.setItem("activeColumns", JSON.stringify(activeColumnsRef.current));
    }

    function hashrate1mHandler(e: boolean) {
        setHashrate1m(e);
        if (e) {
            if (!activeColumnsRef.current.includes("hashrate1m")) {
                activeColumnsRef.current.push("hashrate1m");
            }
        } else {
            activeColumnsRef.current = activeColumnsRef.current.filter(c => c !== "hashrate1m");
        }
        persistActiveColumns();
    }

    function hashrate5mHandler(e: boolean) {
        setHashrate5m(e);
        if (e) {
            if (!activeColumnsRef.current.includes("hashrate5m")) {
                activeColumnsRef.current.push("hashrate5m");
            }
        } else {
            activeColumnsRef.current = activeColumnsRef.current.filter(c => c !== "hashrate5m");
        }
        persistActiveColumns();
    }

    function hashrate1hrHandler(e: boolean) {
        setHashrate1hr(e);
        if (e) {
            if (!activeColumnsRef.current.includes("hashrate1hr")) {
                activeColumnsRef.current.push("hashrate1hr");
            }
        } else {
            activeColumnsRef.current = activeColumnsRef.current.filter(c => c !== "hashrate1hr");
        }
        persistActiveColumns();
    }

    function hashrate1dHandler(e: boolean) {
        setHashrate1d(e);
        if (e) {
            if (!activeColumnsRef.current.includes("hashrate1d")) {
                activeColumnsRef.current.push("hashrate1d");
            }
        } else {
            activeColumnsRef.current = activeColumnsRef.current.filter(c => c !== "hashrate1d");
        }
        persistActiveColumns();
    }

    function hashrate7dHandler(e: boolean) {
        setHashrate7d(e);
        if (e) {
            if (!activeColumnsRef.current.includes("hashrate7d")) {
                activeColumnsRef.current.push("hashrate7d");
            }
        } else {
            activeColumnsRef.current = activeColumnsRef.current.filter(c => c !== "hashrate7d");
        }
        persistActiveColumns();
    }

    function orderHandler(e: ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;
        if (data.length > 0 && value in data[0]) {
            setOrderBy(value as keyof CleanWorkerHashrate);
        } else {
            console.warn(`Invalid order value: ${value}`);
        }
    }

    const options = [
        { id: "1m", label: "1 m", checked: hashrate1m, onChange: (e: boolean) => hashrate1mHandler(e) },
        { id: "5m", label: "5 m", checked: hashrate5m, onChange: (e: boolean) => hashrate5mHandler(e) },
        { id: "1h", label: "1 h", checked: hashrate1hr, onChange: (e: boolean) => hashrate1hrHandler(e) },
        { id: "1d", label: "1 j", checked: hashrate1d, onChange: (e: boolean) => hashrate1dHandler(e) },
        { id: "7d", label: "7 j", checked: hashrate7d, onChange: (e: boolean) => hashrate7dHandler(e) },
    ];

    function normalizeHashrate(workers: (Worker & { weight: number })[]): CleanWorkerHashrate[] {
        return Object.entries(workers).map(([, worker]) => {
            const base: CleanWorkerHashrate = {
                workername: worker.workername,
                lastshare: worker.lastshare,
                shares: worker.shares,
                bestshare: worker.bestshare,
                bestever: worker.bestever,
                hashrate1m: UnitConverter.fromStringToNumber(worker.hashrate1m),
                hashrate5m: UnitConverter.fromStringToNumber(worker.hashrate5m),
                hashrate1h: UnitConverter.fromStringToNumber(worker.hashrate1hr),
                hashrate1d: UnitConverter.fromStringToNumber(worker.hashrate1d),
                hashrate7d: UnitConverter.fromStringToNumber(worker.hashrate7d),
                weight: worker.weight
            }
            if (isCommunityPool) {
                base.rewardBtc = bitcoinBlockReward! * (base.weight / 100);
            }
            return base
        })
    }

    const data = normalizeHashrate(payload);

    return (
        <ThemeProvider theme={theme}>
            <div style={{
                overflow: "scroll",
                flex: 1,
                display: "flex",
                flexDirection: "column"
            }} id="page">
                {isLargeScreen ?
                    <>
                        <div style={{
                            margin: "20px 10px"
                        }}>
                            <StatsWidgetBar data={[
                                {
                                    "title": "Personnes",
                                    "value": data.length,
                                    "icon": User
                                },
                                {
                                    "title": "Machines",
                                    "value": userStats.globalStats.workers,
                                    "icon": Computer
                                }
                            ]} />
                        </div>
                        <Toolbar options={options} />
                        <div id="main-view" style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: 10 }}>
                            <div style={{ display: "flex", flex: 3 }}>
                                <MainGrid workers={data}
                                    btcPrice={bitcoinPrice}
                                    isCommunityPool={isCommunityPool}
                                    isHashrate1mVisible={hashrate1m}
                                    isHashrate5mVisible={hashrate5m}
                                    isHashrate1hrVisible={hashrate1hr}
                                    isHashrate1dVisible={hashrate1d}
                                    isHashrate7dVisible={hashrate7d}
                                    onSelectWorker={setSelectedWorker}
                                />
                            </div>
                            <div style={{ display: "flex", flex: 2, backgroundColor: "var(--card-background-color)", borderRadius: 8, border: "1px solid var(--card-outline-color)" }}>
                                <WorkerPannel worker={selectedWorker} userAddress={userAddress} />
                            </div>
                        </div>
                    </> :
                    <div style={{
                        margin: "0 10px 10px",
                    }}>
                        <div style={{
                            display: "flex",
                            margin: "10px 0",
                            flexWrap: "wrap",
                        }}>
                            <StatsWidgetBar data={[
                                {
                                    "title": "Personnes",
                                    "value": data.length,
                                    "icon": User
                                },
                                {
                                    "title": "Machines",
                                    "value": userStats.globalStats.workers,
                                    "icon": Computer
                                }
                            ]} />
                            <div style={{
                                display: "flex",
                                justifyContent: "right",
                                alignItems: "end",
                                flex: 1,
                                marginTop: 10,
                            }}>
                                <select onChange={orderHandler} style={{
                                    padding: "5px 10px",
                                    border: "1px solid var(--card-outline-color)",
                                    borderRadius: 10,
                                    backgroundColor: "var(--card-background-color)",
                                }} defaultValue={"weight"} id="order-by" name="Trier" aria-label="Trier" title="Trier" >
                                    <optgroup label="Hashrate">
                                        <option value="hashrate5m">5m</option>
                                        <option value="hashrate1h">1h</option>
                                        <option value="hashrate1d">1d</option>
                                    </optgroup>
                                    <optgroup label="Shares">
                                        <option value="shares">Shares</option>
                                        <option value="bestshare">Best share</option>
                                    </optgroup>
                                    <option value="weight"> Poids</option>
                                </select>
                            </div>
                        </div>
                        <WorkerList workers={data} orderBy={orderBy} userAddress={userAddress} btcPrice={bitcoinPrice} btcPerBlock={bitcoinBlockReward} isCommunityPool={isCommunityPool} />
                    </div>
                }
            </div>
        </ThemeProvider>
    );
}
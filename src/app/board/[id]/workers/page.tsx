"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Stats } from "@/../models/API Payloads/Stats";
import { usePathname } from "next/navigation";
import { getBtcBlockReward, getBtcPrice, getPoolWeight, getWorkerStats } from "@/app/api";
import { MainGrid } from "./components/Table";
import { Toolbar } from "./components/Toolbar"
import { Weights } from "../../../../../models/API Payloads/Weights";
import { Worker } from "../../../../../models/Worker";
import ExtractWorkername from "../../../../../lib/ExtractWorkername";
import WorkerPannel from "./components/WorkerPannel";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import "./styles.css";
import { ColDef } from "ag-grid-community";
import UnitConverter from "../../../../../lib/UnitConverter";
import { CleanWorkerHashrate } from "../../../../../models/CleanWorkerHashrate";

const COMMUNITY_POOL_ADDRESS = "bc1qh8ge36h2njrp2aqv5ddpyph4g22elzgkds52ae";





export default function Home() {
    const [workers, setWorkers] = useState<Stats | null>(null); // table
    const [weights, setWeights] = useState<Weights[]>([]);
    const [hashrate1m, setHashrate1m] = useState<boolean>(true);
    const [hashrate5m, setHashrate5m] = useState<boolean>(true);
    const [hashrate1hr, setHashrate1hr] = useState<boolean>(true);
    const [hashrate1d, setHashrate1d] = useState<boolean>(true);
    const [hashrate7d, setHashrate7d] = useState<boolean>(true);
    const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
    const [bitcoinPrice, setBitcoinPrice] = useState<number | null>(null);
    const [bitcoinBlockReward, setBitcoinBlockReward] = useState<number | null>(null);
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
        getWorkerStats(userAddress).then((result) => {
            setWorkers(result);
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


    if (isCommunityPool && (bitcoinPrice === null && bitcoinBlockReward === null)) {
        return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>Préchauffage...</div>;
    }

    if (!workers || !weights.length) {
        return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>Préchauffage...</div>;
    }

    const payload = { ...workers.workers } as (Worker & { weight: number })[];

    Object.entries(payload).forEach(([_, worker]) => {
        const workerName = ExtractWorkername.fromPool(worker.workername);
        worker.weight = Number.parseFloat(weights.find(w => w.worker_id === workerName)?.avg_weight || "0");
    })

    function persistActiveColumns() {
        console.log(activeColumnsRef.current);
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

    const options = [
        { id: "1m", label: "1 m", checked: hashrate1m, onChange: (e: boolean) => hashrate1mHandler(e) },
        { id: "5m", label: "5 m", checked: hashrate5m, onChange: (e: boolean) => hashrate5mHandler(e) },
        { id: "1h", label: "1 h", checked: hashrate1hr, onChange: (e: boolean) => hashrate1hrHandler(e) },
        { id: "1d", label: "1 j", checked: hashrate1d, onChange: (e: boolean) => hashrate1dHandler(e) },
        { id: "7d", label: "7 j", checked: hashrate7d, onChange: (e: boolean) => hashrate7dHandler(e) },
    ];

    function normalizeHashrate(workers: (Worker & { weight: number })[]): CleanWorkerHashrate[] {
        return Object.entries(workers).map(([_, worker]) => {
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
                console.log(bitcoinBlockReward, base.weight)
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
            </div>
        </ThemeProvider>
    );
}
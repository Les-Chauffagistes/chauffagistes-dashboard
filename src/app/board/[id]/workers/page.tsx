"use client";

import { useEffect, useRef, useState } from "react";
import { Stats } from "@/../models/API Payloads/Stats";
import { usePathname } from "next/navigation";
import { getWorkerStats } from "@/app/api";
import { MainGrid } from "./components";
import { Toolbar } from "./components/Toolbar"

export default function Home() {
    const [workers, setWorkers] = useState<Stats | null>(null);
    const [hashrate1m, setHashrate1m] = useState<boolean>(true);
    const [hashrate5m, setHashrate5m] = useState<boolean>(true);
    const [hashrate1hr, setHashrate1hr] = useState<boolean>(true);
    const [hashrate1d, setHashrate1d] = useState<boolean>(true);
    const [hashrate7d, setHashrate7d] = useState<boolean>(true);
    const pathname = usePathname();
    const userID = pathname?.split("/")[2];

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
        getWorkerStats(userID).then((result) => {
            setWorkers(result);
        });
    }, [userID]);

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
        { id: "1m", label: "1 min", checked: hashrate1m, onChange: (e: boolean) => hashrate1mHandler(e) },
        { id: "5m", label: "5 min", checked: hashrate5m, onChange: (e: boolean) => hashrate5mHandler(e) },
        { id: "1h", label: "1 h", checked: hashrate1hr, onChange: (e: boolean) =>  hashrate1hrHandler(e) },
        { id: "1d", label: "1 j", checked: hashrate1d, onChange: (e: boolean) =>  hashrate1dHandler(e) },
        { id: "7d", label: "7 j", checked: hashrate7d, onChange: (e: boolean) =>  hashrate7dHandler(e) },
    ];

    return (
        <div style={{ flex: 1, overflow: "scroll" }} id="page">
            <Toolbar options={options} />
            <MainGrid workers={workers?.workers || []}
                isHashrate1mVisible={hashrate1m}
                isHashrate5mVisible={hashrate5m}
                isHashrate1hrVisible={hashrate1hr}
                isHashrate1dVisible={hashrate1d}
                isHashrate7dVisible={hashrate7d}
            />
        </div>
    );
}
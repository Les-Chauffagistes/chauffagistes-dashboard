"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Stats } from "@/../models/API Payloads/Stats";
import { usePathname } from "next/navigation";
import { getWorkerStats } from "../api";
import { MainGrid, ToolBar } from "./components";

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
            // console.log(result);
            setWorkers(result);
        });
    }, [userID]);

    function persistActiveColumns() {
        console.log(activeColumnsRef.current);
        localStorage.setItem("activeColumns", JSON.stringify(activeColumnsRef.current));
    }

    function hashrate1mHandler(e: ChangeEvent<HTMLInputElement>) {
        setHashrate1m(e.target.checked);
        if (e.target.checked) {
            if (!activeColumnsRef.current.includes("hashrate1m")) {
                activeColumnsRef.current.push("hashrate1m");
            }
        } else {
            activeColumnsRef.current = activeColumnsRef.current.filter(c => c !== "hashrate1m");
        }
        persistActiveColumns();
    }

    function hashrate5mHandler(e: ChangeEvent<HTMLInputElement>) {
        setHashrate5m(e.target.checked);
        if (e.target.checked) {
            if (!activeColumnsRef.current.includes("hashrate5m")) {
                activeColumnsRef.current.push("hashrate5m");
            }
        } else {
            activeColumnsRef.current = activeColumnsRef.current.filter(c => c !== "hashrate5m");
        }
        persistActiveColumns();
    }

    function hashrate1hrHandler(e: ChangeEvent<HTMLInputElement>) {
        setHashrate1hr(e.target.checked);
        if (e.target.checked) {
            if (!activeColumnsRef.current.includes("hashrate1hr")) {
                activeColumnsRef.current.push("hashrate1hr");
            }
        } else {
            activeColumnsRef.current = activeColumnsRef.current.filter(c => c !== "hashrate1hr");
        }
        persistActiveColumns();
    }

    function hashrate1dHandler(e: ChangeEvent<HTMLInputElement>) {
        setHashrate1d(e.target.checked);
        if (e.target.checked) {
            if (!activeColumnsRef.current.includes("hashrate1d")) {
                activeColumnsRef.current.push("hashrate1d");
            }
        } else {
            activeColumnsRef.current = activeColumnsRef.current.filter(c => c !== "hashrate1d");
        }
        persistActiveColumns();
    }

    function hashrate7dHandler(e: ChangeEvent<HTMLInputElement>) {
        setHashrate7d(e.target.checked);
        if (e.target.checked) {
            if (!activeColumnsRef.current.includes("hashrate7d")) {
                activeColumnsRef.current.push("hashrate7d");
            }
        } else {
            activeColumnsRef.current = activeColumnsRef.current.filter(c => c !== "hashrate7d");
        }
        persistActiveColumns();
    }

    return (
        <div style={{ flex: 1 }} id="page">
            <ToolBar {...{
                hashrate1mHandler,
                hashrate5mHandler,
                hashrate1hrHandler,
                hashrate1dHandler,
                hashrate7dHandler,
                hashrate1m,
                hashrate5m,
                hashrate1hr,
                hashrate1d,
                hashrate7d
            }} />
            <MainGrid workers={workers?.workers || []}
                hashrate1m={hashrate1m}
                hashrate5m={hashrate5m}
                hashrate1hr={hashrate1hr}
                hashrate1d={hashrate1d}
                hashrate7d={hashrate7d}
            />
        </div>
    );
}
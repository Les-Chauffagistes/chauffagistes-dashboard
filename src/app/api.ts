import { Stats } from "../../models/API Payloads/Stats";

export async function getWorkerStats(address: string): Promise<Stats> {
    return await fetch(`/api/stats/${address}`).then((res) => res.json());
}

export async function getWorkerStatsHistory(worker_name: string, period: "30d" | "forever"): Promise<Stats> {
    const url = `/api/history/${worker_name}/${period}`;
    console.log(url);
    return await fetch(url).then((res) => res.json());
}
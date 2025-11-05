import { UserInstantStats } from "../../models/API Payloads/Stats";
import { PoolHistoryRecord } from "../../models/API Payloads/PoolHistoryRecord";
import { WorkerHistoryRecord } from "../../models/API Payloads/WorkerHistoryRecord";
import { BitcoinPrice } from "../../models/API Payloads/BitcoinPrice";
import { AllWorkersHistoryRecord } from "../../models/API Payloads/AllWorkersHistoryRecord";

export async function getPoolStats(address: string): Promise<UserInstantStats> {
    return await fetch(`/api/stats/${address}`).then((res) => res.json());
}

export async function getWorkerStatsHistory(userAddress: string, workerName: string, period: "30d" | "forever"): Promise<WorkerHistoryRecord[]> {
    const url = `/api/history/${userAddress}/worker/${workerName}/${period}`;
    return await fetch(url).then((res) => res.json());
}

export async function getPoolHistory(userAddress: string): Promise<PoolHistoryRecord[]> {
    return await fetch(`/api/poolhistory/${userAddress}`).then((res) => res.json());
}

export async function getPoolWeight(userAddress: string) {
    return await fetch(`/api/weights/${userAddress}`).then((res) => res.json());
}

export async function getBtcPrice(): Promise<BitcoinPrice> {
    return await fetch(`/api/bitcoin-price`).then((res) => res.json());
}

export async function getBtcBlockReward(): Promise<number> {
    return await fetch(`/api/bitcoin-block-reward`).then((res) => res.json());
}

export async function getAllWorkersHistory(userAddress: string): Promise<AllWorkersHistoryRecord[]> {
    return await fetch(`/api/history/${userAddress}`).then((res) => res.json());
}
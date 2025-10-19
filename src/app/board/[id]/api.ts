import { Stats } from "../../../../models/API Payloads/Stats";

export async function getWorkerStats(address: string): Promise<Stats> {
    return await fetch(`/api/stats/${address}`).then((res) => res.json());
}
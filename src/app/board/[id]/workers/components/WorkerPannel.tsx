import ExtractWorkername from "../../../../../../lib/ExtractWorkername";
import { Worker } from "../../../../../../models/Worker";
import HashreateLine from "./HashrateLine";
import { useWorkerStats } from "@/app/hooks/useWorkerStats";



export default function WorkerPannel({ userAddress, worker }: { userAddress: string, worker: Worker | null }) {
    const { stats } = useWorkerStats(userAddress, ExtractWorkername.fromPool(worker?.workername ?? ""));
    if (!worker) {
        return (
            <div style={{
                flex: 1,
                height: "100%",
            }}>
                <h2 style={{ marginTop: "1rem", marginLeft: "1rem" }}>
                    Sélectionnez un mineur
                </h2>
                <HashreateLine history={[]} />
            </div>
        )
    }

    return (
        <div style={{
            flex: 1,
            height: "100%",
        }}>
            <h2 style={{ marginTop: "1rem", marginLeft: "1rem" }}>
                {ExtractWorkername.fromPool(worker.workername)}
            </h2>
            <HashreateLine history={stats} />
        </div>
    )
}
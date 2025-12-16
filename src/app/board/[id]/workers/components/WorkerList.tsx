import { CleanWorkerHashrate } from "../../../../../../models/CleanWorkerHashrate"
import WorkerCard from "./WorkerCard"
import WorkerPopup from "./WorkerPopup"

export type WorkerListProps = {
    workers: (CleanWorkerHashrate & { weight: number })[],
    orderBy: keyof (CleanWorkerHashrate & { weight: number }),
    searchContent?: string,   
    userAddress: string,
    btcPrice: number | null,
    isCommunityPool: boolean
}

export default function WorkerList({ workers, orderBy, searchContent = "", userAddress, btcPrice = null, isCommunityPool }: Readonly<WorkerListProps>) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 10
        }}>
            {[...workers].sort((a, b) => Number(b[orderBy]) - Number(a[orderBy])).filter(worker => worker.workername.toLowerCase().includes(searchContent.toLowerCase())).map(worker => {
                return (
                    <WorkerPopup key={worker.workername} userAddress={userAddress} worker={worker}>
                        <button style={{
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer"
                        }}>
                            <WorkerCard worker={worker} btcPrice={btcPrice} isCommunityPool={isCommunityPool} />
                        </button>
                    </WorkerPopup>
                )
            })}
        </div>
    )
}
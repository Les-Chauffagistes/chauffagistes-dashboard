import { Computer } from "lucide-react";
import { LinkedWorkers } from "../../../../../../models/API Payloads/LinkedWorkers";
import { Tooltip } from "@mui/material";



export default function LinkedWorkersList({ worker }: Readonly<{ worker: LinkedWorkers | undefined }>) {
    return (
        <Tooltip title={"Ce workername vous appartient"} arrow placement="bottom">
            <div style={{
                display: "flex",
                gap: 5,
                alignItems: "center"
            }}>
                <Computer size={22}/>
                {worker ?
                    <div key={worker.workername}>
                        {worker.workername}
                    </div>
                    :
                    null
                }
            </div>
        </Tooltip>
    )
}
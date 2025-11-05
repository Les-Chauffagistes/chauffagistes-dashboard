import { Pool } from "../Pool"
import { User } from "../User"
import { Repartition } from "../Repartition"
import { BestRecord } from "../BestRecord"
import { Node } from "../Node"

// Used in /api/data
export interface PoolInstantStats {
    backup_pool: boolean
    pool: Pool
    users: Record<string, User>
    repartition: Record<string, Repartition>
    monthly_bests: BestRecord[]
    node: Node
}
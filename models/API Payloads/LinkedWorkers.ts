export type LinkedWorkers = {
    btc_address: string
    user: number
    workername: string
    status: "done" | "pending"
    created_at: Date,
    code?: number
}
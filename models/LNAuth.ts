export type LNAuth = {
    k1: string
    status: "pending" | "done"
    user_id?: number // défini temporairement entre le statut validé et l'enregistrement dans la table user
    created_at: Date 
}
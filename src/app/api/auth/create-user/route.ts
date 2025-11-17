// POST /api/auth/create-user
import { pool } from "@/../lib/Postrgre";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {

        const { username } = await req.json();
        if (!username) return NextResponse.json({ error: "Missing username" }, { status: 400 });
        
        const userId = uuidv4();           // string UUID
        const challenge = uuidv4();        // challenge unique pour l'inscription
        
        // Stocke le pré-utilisateur avec challenge temporaire
        await pool.query(
            `INSERT INTO pending_users (id, username, challenge, created_at) VALUES ($1, $2, $3, now())`,
            [userId, username, challenge]
        );
        
        return NextResponse.json({ userId, challenge });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("error /create", message);
        return NextResponse.json({ error: "upstream_failed" }, { status: 502 });
    }
}
// src/app/api/auth/lnurl/callback/route.ts
import { NextResponse } from "next/server";

import { pool } from "../../../../../../lib/Postrgre";
import { ec as EC } from "elliptic";
const secp = new EC("secp256k1");


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const k1 = searchParams.get("k1");
    const sig = searchParams.get("sig");
    const key = searchParams.get("key");

    if (!k1 || !sig || !key) return NextResponse.json({ status: "ERROR" });

    const k1Bytes = Buffer.from(k1, "hex");
    const sigDER = Buffer.from(sig, "hex");
    const keyBuffer = Buffer.from(key, "hex");

    const pub = secp.keyFromPublic(keyBuffer, "hex");
    const ok = pub.verify(k1Bytes, sigDER);
    if (!ok) return NextResponse.json({ status: "ERROR" });

    // Vérifier que k1 existe
    const auth = await pool.query(
        "SELECT * FROM lnurl_auth WHERE k1 = $1",
        [k1]
    );
    if (auth.rows.length === 0)
        return NextResponse.json({ status: "ERROR" });

    // Associer ou créer utilisateur
    let userId: number;

    const existing = await pool.query(
        "SELECT id FROM users WHERE ln_key = $1",
        [key]
    );

    if (existing.rows.length > 0) {
        userId = existing.rows[0].id;
    } else {
        const inserted = await pool.query(
            "INSERT INTO users (ln_key) VALUES ($1) RETURNING id",
            [key]
        );
        userId = inserted.rows[0].id;
    }

    // Mise à jour du challenge
    await pool.query(
        "UPDATE lnurl_auth SET status='done', user_id=$1 WHERE k1=$2",
        [userId, k1]
    );

    return NextResponse.json({ status: "OK" });
}
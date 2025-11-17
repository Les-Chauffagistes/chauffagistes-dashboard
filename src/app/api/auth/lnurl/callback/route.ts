// src/app/api/auth/lnurl/callback/route.ts
import { NextResponse } from "next/server";
import { verify } from "@noble/secp256k1";
import { pool } from "../../../../../../lib/Postrgre";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const k1 = searchParams.get("k1");
    const sig = searchParams.get("sig");
    const key = searchParams.get("key");

    if (!k1 || !sig || !key) return NextResponse.json({ status: "ERROR" });

    await pool.query("INSERT INTO lnurl_auth (k1, status) VALUES ($1, 'pending');", [k1]);

    const msg = Buffer.from(k1, "hex");

    const ok = verify(
        Buffer.from(sig, "hex"),
        msg,
        Buffer.from(key, "hex")
    );

    if (!ok) return NextResponse.json({ status: "ERROR" });

    // associer clé publique à un user
    const result = await pool.query("SELECT * FROM lnurl_auth WHERE k1 = $1;", [k1]);
    let user: string = result.rows[0].id;
    if (!user) {
        user = (await pool.query("INSERT INTO users (id) VALUES (DEFAULT) RETURNING id;")).rows[0].id;
    }

    await pool.query("UPDATE lnurl_auth SET status = 'done', user_id = $1 WHERE k1 = $2;", [user, k1]);

    return NextResponse.json({ status: "OK" });
}
// src/app/api/auth/lnurl/status/route.ts
import { NextResponse } from "next/server";
import { pool } from "../../../../../../lib/Postrgre";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const k1 = searchParams.get("k1");

    const result = await pool.query("SELECT status, user_id FROM lnurl_auth WHERE k1 = $1;", [k1]);
    const record = result.rows[0];
    if (!record) return NextResponse.json({ authenticated: false });

    if (record.status !== "done") return NextResponse.json({ authenticated: false });

    return NextResponse.json({ authenticated: true, userId: record.userId });
}
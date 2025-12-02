// src/app/api/auth/lnurl/status/route.ts
import { NextResponse } from "next/server";
import { pool } from "../../../../../server/Postrgre";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "@/app/api/lib/session";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const k1 = searchParams.get("k1");

    const result = await pool.query("SELECT * FROM lnurl_auth WHERE k1 = $1;", [k1]);
    const record = result.rows[0];
    if (!record) return NextResponse.json({ authenticated: false });

    if (record.status === "done") {
        const session = await getIronSession<{user: {id: string} | null}>(await cookies(), sessionOptions);
        session.user = { id: record.user_id };
        console.log("saving session", {session});
        await session.save();
        await pool.query("DELETE FROM lnurl_auth WHERE k1 = $1;", [k1]);
        return NextResponse.json({ authenticated: true, userId: record.user_id });
    }

    return NextResponse.json({ authenticated: false });
}
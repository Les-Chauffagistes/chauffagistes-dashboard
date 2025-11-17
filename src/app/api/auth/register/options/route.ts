// GET /api/auth/register/options?userId=...
import { pool } from "@/../lib/Postrgre";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    console.log(url);
    const userId = url.searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    console.log("userId", userId);
    // Récupère le challenge temporaire
    const result = await pool.query(`SELECT username FROM pending_users WHERE id=$1`, [userId]);
    if (result.rows.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { username } = result.rows[0];

    const options = await generateRegistrationOptions({
        rpName: "MonSite",
        rpID: "localhost",
        userID: new Uint8Array(Buffer.from(userId, 'hex')),
        userName: username,
        attestationType: "none",
        authenticatorSelection: { userVerification: "preferred" },
        excludeCredentials: [] // ou les credentials existants si tu veux
    });

    console.debug("options", JSON.stringify(options));
    await pool.query(`UPDATE pending_users SET challenge=$1 WHERE id=$2`, [options.challenge, userId]);


    return NextResponse.json(options);
}
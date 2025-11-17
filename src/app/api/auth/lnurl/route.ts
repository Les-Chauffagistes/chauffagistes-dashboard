// src/app/api/auth/lnurl/route.ts
import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { bech32, bech32m } from "@scure/base";
import { pool } from "../../../../../lib/Postrgre";

const BASE = process.env.NEXT_PUBLIC_BASE_URL; // https://tonsite.com

export async function GET() {
    const k1 = crypto.randomBytes(32).toString("hex");

    // stocker k1 dans ta DB avec status “pending”
    await pool.query("INSERT INTO lnurl_auth (k1, status) VALUES ($1, 'pending');", [k1]);

    const callback = `${BASE}/api/auth/lnurl/callback?k1=${k1}`;
    console.debug("callback:", callback)
    const lnurl = bech32encode(callback);
    console.log("encoded", lnurl)
    try {
        const decoded = bech32m.decode(lnurl, 1023);
        const url = Buffer.from(bech32m.fromWords(decoded.words)).toString("utf8");
        console.log("decoded", url);
    } catch (error) {
        console.error("error encoded", error);
    }
    return NextResponse.json({ lnurl, k1 });
}

// encode LNURL en bech32
function bech32encode(url: string) {
    const words = bech32m.toWords(Buffer.from(url, "utf8"));
    return bech32m.encode("lnurl", words, 1023);
}
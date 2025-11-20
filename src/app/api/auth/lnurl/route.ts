import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { bech32m, bech32 } from "@scure/base";
import { pool } from "../../../../server/Postrgre";

const BASE = process.env.NEXT_PUBLIC_BASE_URL;
export async function GET() {
    const k1 = crypto.randomBytes(32).toString("hex");

    // stocker k1 dans ta DB avec status “pending”
    await pool.query("INSERT INTO lnurl_auth (k1, status) VALUES ($1, 'pending');", [k1]);

    const callback = `${BASE}/api/auth/lnurl/callback?k1=${k1}&tag=login`;
    // console.debug("callback:", callback)
    const lnurl = bech32encode(callback);

    return NextResponse.json({ lnurl, k1 });
}

// encode LNURL en bech32
function bech32mencode(url: string) {
    const words = bech32m.toWords(Buffer.from(url, "utf8"));
    return bech32m.encode("lnurl", words, 1023);
}

function bech32encode(url: string) {
    const words = bech32.toWords(Buffer.from(url, "utf8"));
    return bech32.encode("lnurl", words, 1023);
}

function bech32mdecode(lnurl: `${string}1${string}`) {
    const decoded = bech32m.decode(lnurl, 1023);
    return Buffer.from(bech32m.fromWords(decoded.words)).toString("utf8");
}

function bech32decode(lnurl: `${string}1${string}`) {
    const decoded = bech32.decode(lnurl, 1023);
    return Buffer.from(bech32.fromWords(decoded.words)).toString("utf8");
}
import { NextResponse } from "next/server";
import { ec as EC } from "elliptic";
import { prisma } from "@/server/Prisma";
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

    const auth = await prisma.lnurl_auth.findUnique({ where: { k1 } });
    if (!auth) return NextResponse.json({ status: "ERROR" });

    let userId: bigint;

    const account = await prisma.ln_users.findFirst({
        where: { ln_key: key }
    });

    if (account) {
        userId = account.user_id!;
    } else {
        const user = await prisma.users.create({ data: {} });

        await prisma.ln_users.create({
            data: {
                ln_key: key,
                user_id: user.id
            }
        });

        userId = user.id;
    }

    await prisma.lnurl_auth.update({
        where: { k1 },
        data: {
            status: "done",
            user_id: userId
        }
    });

    return NextResponse.json({ status: "OK" });
}
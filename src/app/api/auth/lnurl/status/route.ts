// src/app/api/auth/lnurl/status/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/server/Prisma";
import { createSession } from "@/app/api/lib/session";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const k1 = searchParams.get("k1");

    if (!k1) return NextResponse.json({ authenticated: false });

    const record = await prisma.lnurl_auth.findUnique({ where: { k1 } });
    if (!record) {
        console.log("[lnurl status] record not found for k1");
        return NextResponse.json({ authenticated: false });
    }

    console.log("[lnurl status] record status:", record.status);

    if (record.status === "done") {
        await createSession(Number(record.user_id));
        await prisma.lnurl_auth.delete({ where: { k1 } });
        return NextResponse.json({ authenticated: true, userId: Number(record.user_id) });
    }

    return NextResponse.json({ authenticated: false });
}

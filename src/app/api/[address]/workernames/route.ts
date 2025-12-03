import { serialize } from "@/app/api/lib/serialize";
import getCurrentUser from "@/app/api/session/utils";
import { prisma } from "@/server/Prisma";
import { NextResponse } from "next/server";



export async function GET(req: Request, { params }: { params: Promise<{ address: string }> }) {
    const p = await params;
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({error: "Auth required"});
    }
    const associations = await prisma.workernames.findMany({
        where: {
            btc_address: p.address,
            user: user.id,
            OR: [{status: "done"}, {status: "pending"}]
        }
    })
    return NextResponse.json(serialize(associations))

}
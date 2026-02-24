import { NextResponse } from "next/server";
import { getSession } from "@/app/api/lib/session";
import { prisma } from "@/server/Prisma";
import { serialize } from "@/app/api/lib/serialize";

export async function GET() {
    const user = await getSession();
    if (!user) {
        return NextResponse.json({error: "Auth required"}, {status: 401})
    }
    const lnUser = await prisma.ln_users.findFirst({where: {user_id: user.id}})
    return NextResponse.json(serialize(lnUser))
}

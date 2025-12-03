import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "@/app/api/lib/session";
import { prisma } from "@/server/Prisma";
import { serialize } from "@/app/api/lib/serialize";

export async function GET() {
    const session = await getIronSession<{user: {id: number} | null}>(await cookies(), sessionOptions);
    if (!session.user) {
        return NextResponse.json({error: "Auth required"}, {status: 401})
    }
    const user = await prisma.ln_users.findFirst({where: {id: session.user.id}})
    console.log(user?.id)
    return NextResponse.json(serialize(user))
}
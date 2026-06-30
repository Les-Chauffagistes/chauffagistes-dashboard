import { NextResponse } from "next/server";
import { prisma } from "@/server/Prisma";
import { userModel } from "../../../../generated/prisma/models/user";
import { getMe } from "@/lib/auth";
import { getServerCookieHeader } from "@/lib/auth.server";

export async function GET() {
    try {
        const baseUser = await getMe(await getServerCookieHeader());
        if (!baseUser) return NextResponse.json(null, { status: 401 });

        let heatboardUser = await prisma.users.findFirst({ where: { id: baseUser.user_id } });
        heatboardUser ??= await prisma.users.create({data: {id: baseUser.user_id}});

        return NextResponse.json({ id: heatboardUser.id, address: heatboardUser.address, pseudo: baseUser.pseudo });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const data: Partial<Omit<userModel, "id">> = await req.json();
        const baseUser = await getMe(await getServerCookieHeader());
        if (!baseUser) return NextResponse.json({ error: "Auth required" }, { status: 401 });

        await prisma.users.update({
            where: { id: baseUser.user_id },
            data,
        });

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
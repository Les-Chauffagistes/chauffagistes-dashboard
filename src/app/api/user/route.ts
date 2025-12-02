import { NextResponse } from "next/server";
import { prisma } from "@/server/Prisma";
import { usersModel } from "../../../../generated/prisma/models/users";
import getCurrentUser from "../session/utils";



export async function PATCH(req: Request) {
    try {
        const data: Partial<Omit<usersModel, "id">> = await req.json()
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({error: "Auth required"}, {status: 401})
        }

        await prisma.users.update({
            where: { id: currentUser.id },
            data
        });

        return NextResponse.json({ok: true})

    } catch (e) {
        console.log(e)
        return NextResponse.json({ok: false}, {status: 500})
    }
}
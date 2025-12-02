import { getServerSession } from "next-auth";
import { getLightningSession, sessionOptions } from "../lib/session";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/server/Prisma";
import { serialize } from "../lib/serialize";
import { usersModel } from "../../../../generated/prisma/models/users";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";



export async function GET() {
    console.log("getting session");
    const lnSession = await getLightningSession();
    const dcSession = await getServerSession(authOptions);
    let user: usersModel | null = null;
    if (lnSession) {
        console.log("ln session found");
        user = await prisma.users.findUnique({
            where: {
                id: lnSession.id
            }
        })
        // new user
        if (user) {
            console.log("ln user found", user.id);
        } else {
            console.log("creating new user");
            const lnUser = await prisma.ln_users.create({
                data: {

                }
            });
            console.log("created ln user", lnUser.id);
        }
    } else if (dcSession) {
        console.log("ln session not found")
        if (dcSession?.user) {
            console.log("dc session found");
            const dcUser = await prisma.discord_users.findUnique({
                where: {
                    id: dcSession.user.id
                }
            })
            // new user
            if (dcUser) {
                console.log("user found");
                user = await prisma.users.findUnique({
                    where: {
                        id: dcUser.user_id
                    }
                })
            } else {
                console.log("user not found, crating...")
                user = await prisma.users.create({})
                await prisma.discord_users.create({
                    data: {
                        id: dcSession.user.id,
                        user_id: user.id,
                        discord_name: dcSession.user.name,
                    }
                });
            }
        } else {
            console.log("dc session not found");
        }
    } else {
        console.log("no session found");
    }
    if (user) return NextResponse.json(serialize(user));
    else return NextResponse.json({ error: "Auth required" }, { status: 401 });
}


export async function DELETE() {
    const res = new Response()

    const session = await getIronSession(await cookies(), sessionOptions)

    session.destroy()            // invalide la session en mémoire
    res.headers.append(
        "Set-Cookie",
        `${sessionOptions.cookieName}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`
    )

    return res
}
import { prisma } from "@/server/Prisma";
import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionData {
    userId?: number;
}

export const sessionOptions = {
    password: process.env.SESSION_PASSWORD!,
    cookieName: "heatboard-session",
    cookieOptions: {
        domain: process.env.COOKIE_DOMAIN ?? ".chauffagistes-btc.fr",
        path: "/",
        httpOnly: true,
        sameSite: "lax" as const,
        secure: true,
    },
};

async function getIronSessionData(): Promise<IronSession<SessionData>> {
    return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function getSession() {
    const session = await getIronSessionData();
    if (!session.userId) return null;
    const user = await prisma.users.findUnique({ where: { id: session.userId } });
    return user;
}

export async function createSession(userId: number) {
    const session = await getIronSessionData();
    session.userId = userId;
    await session.save();
}

export async function destroySession() {
    const session = await getIronSessionData();
    session.destroy();
}

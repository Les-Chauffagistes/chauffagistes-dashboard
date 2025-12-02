import { prisma } from "@/server/Prisma";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export const sessionOptions = {
    password: process.env.SESSION_PASSWORD!,
    cookieName: "lightning",
    cookieOptions: {
        secure: true,
    },
};

export async function getLightningSession() {
    const session = await getIronSession<{user: {id: string} | null}>(await cookies(), sessionOptions);
    console.log("ln session", {session});
    if (!session.user) {
        return null
    }
    const user = await prisma.users.findFirst({where: {id: Number.parseInt(session.user.id)}})
    return user
}
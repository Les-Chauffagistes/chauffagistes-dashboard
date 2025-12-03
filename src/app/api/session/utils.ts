import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getLightningSession } from "../lib/session";
import { usersModel } from "../../../../generated/prisma/models";
import { prisma } from "@/server/Prisma";

export default async function getCurrentUser() {
    const lnSession = await getLightningSession();
    
    let user: usersModel | null = null;
    if (lnSession) {
        console.log("ln session found: ", lnSession.id);
        console.log("ln session: ", lnSession); // lnSession.id est l'id utilisateur
        user = await prisma.users.findUnique({
            where: {
                id: lnSession.id
            }
        })
        
    }

    const dcSession = await getServerSession(authOptions);
    if (dcSession?.user) {
        const dcUser = await prisma.discord_users.findUnique({
            where: {
                id: dcSession.user.id
            }
        })
        if (dcUser) {
            user = await prisma.users.findUnique({
                where: {
                    id: dcUser.user_id
                }
            })
        }
    }

    return user
}
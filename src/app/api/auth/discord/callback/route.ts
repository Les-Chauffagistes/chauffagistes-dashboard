import { NextResponse } from "next/server";
import { prisma } from "@/server/Prisma";
import { createSession } from "@/app/api/lib/session";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state") ?? "/";

    if (!code) {
        return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    // Exchange code for access token
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID!,
            client_secret: process.env.DISCORD_CLIENT_SECRET!,
            grant_type: "authorization_code",
            code,
            redirect_uri: process.env.DISCORD_REDIRECT_URI!,
        }),
    });

    if (!tokenRes.ok) {
        return NextResponse.json({ error: "Token exchange failed" }, { status: 502 });
    }

    const { access_token } = await tokenRes.json();

    // Fetch Discord user profile
    const profileRes = await fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!profileRes.ok) {
        return NextResponse.json({ error: "Failed to fetch Discord profile" }, { status: 502 });
    }

    const profile = await profileRes.json();

    // Find or create user in a transaction
    const user = await prisma.$transaction(async (tx) => {
        const existing = await tx.discord_users.findUnique({
            where: { id: profile.id },
        });

        if (existing) {
            // Update discord name if changed
            if (existing.discord_name !== profile.username) {
                await tx.discord_users.update({
                    where: { id: profile.id },
                    data: { discord_name: profile.username },
                });
            }
            return await tx.users.findUnique({ where: { id: existing.user_id } });
        }

        // New user
        const newUser = await tx.users.create({ data: {} });
        await tx.discord_users.create({
            data: {
                id: profile.id,
                user_id: newUser.id,
                discord_name: profile.username,
            },
        });
        return newUser;
    });

    if (!user) {
        return NextResponse.json({ error: "User creation failed" }, { status: 500 });
    }

    await createSession(Number(user.id));

    return NextResponse.redirect(new URL(state, process.env.NEXT_PUBLIC_BASE_URL));
}

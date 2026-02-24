import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const redirect = searchParams.get("redirect") ?? "/";

    const params = new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        redirect_uri: process.env.DISCORD_REDIRECT_URI!,
        response_type: "code",
        scope: "identify",
        state: redirect,
    });

    return NextResponse.redirect(
        `https://discord.com/oauth2/authorize?${params.toString()}`
    );
}

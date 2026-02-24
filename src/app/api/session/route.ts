import { getSession, destroySession } from "../lib/session";
import { NextResponse } from "next/server";
import { serialize } from "../lib/serialize";

export async function GET() {
    const user = await getSession();
    if (user) return NextResponse.json(serialize(user));
    return NextResponse.json({ error: "Auth required" }, { status: 401 });
}

export async function DELETE() {
    await destroySession();
    return new NextResponse(null, { status: 204 });
}

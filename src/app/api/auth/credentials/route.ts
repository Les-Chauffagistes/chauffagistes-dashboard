import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/server/Prisma";
import { createSession } from "@/app/api/lib/session";

const schema = z.object({
    username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
    password: z.string().min(8),
});

export async function POST(req: Request) {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Nom d'utilisateur (3-30 caractères alphanumériques) et mot de passe (8+ caractères) requis." }, { status: 400 });
    }

    const { username, password } = parsed.data;

    const existing = await prisma.password_users.findUnique({
        where: { username },
    });

    if (existing) {
        const valid = await bcrypt.compare(password, existing.password);
        if (!valid) {
            return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
        }
        await createSession(Number(existing.user_id));
        return NextResponse.json({ ok: true }, { status: 200 });
    }

    const user = await prisma.users.create({ data: {} });

    await prisma.password_users.create({
        data: {
            username,
            password: await bcrypt.hash(password, 12),
            user_id: user.id,
        },
    });

    await createSession(Number(user.id));
    return NextResponse.json({ ok: true }, { status: 201 });
}

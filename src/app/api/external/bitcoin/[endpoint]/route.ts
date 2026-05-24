import { NextResponse } from "next/server";
import { env } from "@/server/env";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ endpoint: string }> }) {
  const { endpoint } = await params;

  try {
    const upstream = await fetch(`${env.bitcoinApiUrl}/v1/${endpoint}`, {
      cache: "no-store",
    });

    const body = await upstream.text();

    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json({ error: "upstream_failed" }, { status: 502 });
  }
}

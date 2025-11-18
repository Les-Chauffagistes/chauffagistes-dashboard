import { NextResponse } from "next/server";

export const GET = async(_req: Request, { params }: { params: Promise<{ address: string }> }) => {
  try {

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const p = await params;

    const upstream = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats/${p.address}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (upstream.status === 404) return NextResponse.json({ exists: false }, { status: 200 });
    else if (upstream.status === 200) return NextResponse.json({ exists: true }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "upstream_failed" }, { status: 502 });
  }
}
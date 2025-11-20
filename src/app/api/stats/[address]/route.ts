import { NextResponse } from "next/server";

export const GET = async(_req: Request, { params }: { params: Promise<{ address: string }> }) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  
  try {
    const p = await params;

    const upstream = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats/${p.address}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      cache: "no-store",
    });

    const bodyText = await upstream.text();
    return new NextResponse(bodyText, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json({ error: "upstream_failed" }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
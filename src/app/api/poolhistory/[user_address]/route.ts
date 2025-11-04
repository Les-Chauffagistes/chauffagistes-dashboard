import { NextResponse } from "next/server";
import { pool } from "@/../lib/Postrgre";

export const GET = async (_req: Request, params: { params: Promise<{ user_address: string }> }) => {
  try {
    const p = await params.params;
    const result = await pool.query(
      `
        SELECT SUM(avg_hashrate1h) "avg_hashrate1h", SUM(avg_hashrate1d) "avg_hashrate1d", date_trunc('minute', timestamp) "timestamp"
        FROM public.worker_stats_raw 
        WHERE "user" = $1
        GROUP BY date_trunc('minute', timestamp)
        ORDER BY date_trunc('minute', timestamp) DESC;
      `,
      [p.user_address]
    )
    
    return new NextResponse(JSON.stringify(result.rows), {
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "upstream_failed" }, { status: 502 });
  }
} 
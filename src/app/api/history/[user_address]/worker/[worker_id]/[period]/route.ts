import { NextResponse } from "next/server";
import { pool } from "@/server/Postrgre";

const VALID_TABLES: Record<string, string> = {
  "30d": "worker_stats_raw",
  "forever": "worker_stats_daily",
} as const;

export const GET = async (_req: Request, { params }: { params: Promise<{ user_address: string, worker_id: string, period: string }> }) => {
  try {
    const p = await params;
    const table = VALID_TABLES[p.period];
    
    if (!table) {
      return NextResponse.json({ error: "invalid_period" }, { status: 400 });
    }
    
    const result = await pool.query(
      `
        SELECT timestamp, avg_hashrate1m, avg_hashrate5m, avg_hashrate1h, avg_hashrate1d, avg_hashrate7d, avg_weight
        FROM ${table}
        WHERE (
          worker_id = $1
          AND
          "user" = $2
        )
        ORDER BY timestamp ASC
      `,
      [p.worker_id, p.user_address]
    )
    
    return NextResponse.json(result.rows, {
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "upstream_failed" }, { status: 502 });
  }
} 
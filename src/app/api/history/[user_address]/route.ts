import { NextResponse } from "next/server";
import { pool } from "@/../lib/Postrgre";

export const GET = async (_req: Request, { params }: { params: Promise<{ user_address: string }> }) => {
  try {
    const p = await params;

    // Utilise une materialized view pour optimiser la performance (actu toutes les heures, fonctionne sur 30 jours avec les stats datant d'1h et plus)
    const q1 = `
      SELECT
          worker_id,
          time_bucket('6 hours', "timestamp") AS bucket,
          ROUND(AVG(avg_hashrate1h)::numeric, 0) AS avg_hashrate1h,
          ROUND(AVG(avg_weight)::numeric, 3) AS avg_weight
      FROM worker_stats_raw
      WHERE "user" = $1
      GROUP BY "user", worker_id, bucket
      ORDER BY "user", worker_id, bucket DESC;
    `
    const q2 = `
        SELECT worker_id, bucket, avg_hashrate1h FROM worker_stats_6h
        WHERE "user" = $1
        ORDER BY worker_id, bucket DESC;
    `
    const result = await pool.query(
      q1,
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
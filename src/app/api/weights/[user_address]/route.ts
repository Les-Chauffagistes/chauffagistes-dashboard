import { NextResponse } from "next/server";
import { pool } from "@/server/Postrgre";

export const GET = async (_req: Request, params: { params: Promise<{ user_address: string }> }) => {
    try {
        const p = await params.params;
        const result = await pool.query(
            `
                SELECT * FROM (
                    SELECT DISTINCT ON (worker_id) 
                        worker_id, 
                        avg_weight,
                        timestamp
                    FROM public.worker_stats_raw
                    WHERE "user" = $1
                    ORDER BY worker_id, timestamp DESC
                ) AS latest_records
                ORDER BY avg_weight DESC;
            `,
            [p.user_address]
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
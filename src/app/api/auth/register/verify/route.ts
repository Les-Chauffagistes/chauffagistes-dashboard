import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { pool } from "@/../lib/Postrgre";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, response } = body;
  if (!userId || !response) return new Response(JSON.stringify({ error: "Missing" }), { status: 400 });

  const result = await pool.query(`SELECT username, challenge FROM pending_users WHERE id=$1`, [userId]);
  if (result.rows.length === 0) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });

  const { username, challenge } = result.rows[0]; // challenge est la base64url stockée précédemment

  try {
    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: challenge,               // EXACT match avec options.challenge
      expectedOrigin: "http://localhost:3000",
      expectedRPID: "localhost",
    });

    if (!verification.verified) return new Response(JSON.stringify({ verified: false }), { status: 400 });

    const { credential } = verification.registrationInfo;

    await pool.query("BEGIN");
    await pool.query(`INSERT INTO users (id, username) VALUES ($1, $2)`, [userId, username]);
    await pool.query(
      `INSERT INTO credentials (id, user_id, public_key, sign_count) VALUES ($1, $2, $3, $4)`,
      [credential.id, userId, credential.publicKey, credential.counter]
    );
    await pool.query(`DELETE FROM pending_users WHERE id=$1`, [userId]);
    await pool.query("COMMIT");

    return new Response(JSON.stringify({ verified: true }), { status: 200 });
  } catch (e) {
    await pool.query("ROLLBACK");
    return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500 });
  }
}
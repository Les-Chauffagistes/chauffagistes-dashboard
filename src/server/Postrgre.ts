// lib/db.ts
import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.PGHOST,
  port: Number.parseInt(process.env.PGPORT!),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});
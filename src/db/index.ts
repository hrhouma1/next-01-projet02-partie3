import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/* Pool Postgres partagé pour les Server Actions */
const pool = new Pool({
  connectionString: process.env.XATA_DATABASE_URL,
  max: 20,              // connexions simultanées
});

export const db = drizzle(pool);